import { NextRequest, NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import type { ExamResult } from '@/lib/types'

export async function POST(request: NextRequest) {
  const user = getServerUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as Partial<ExamResult>
    const { paper_id, score, max_score, time_taken_seconds, answers_json, oe_flagged } = body

    if (!paper_id || score === undefined || max_score === undefined || time_taken_seconds === undefined || !answers_json) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const db = createServiceClient()

    const result: ExamResult = {
      user_id: user.userId,
      paper_id,
      score,
      max_score,
      time_taken_seconds,
      answers_json,
      oe_flagged: oe_flagged ?? false,
    }

    const { error } = await db.from('exam_results').insert(result)
    if (error) throw error

    // Increment papers_completed in progress
    await db.rpc('increment_papers_completed', { p_user_id: user.userId })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save exam result.' }, { status: 500 })
  }
}

export async function GET() {
  const user = getServerUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createServiceClient()
  const { data, error } = await db
    .from('exam_results')
    .select('*')
    .eq('user_id', user.userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch exam results.' }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
