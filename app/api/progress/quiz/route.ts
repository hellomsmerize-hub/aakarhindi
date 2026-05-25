import { NextRequest, NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import type { QuizResult, Module } from '@/lib/types'

export async function POST(request: NextRequest) {
  const user = getServerUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = (await request.json()) as Partial<QuizResult>
    const { module: mod, topic, score, total, time_taken_seconds } = body

    if (!mod || !topic || score === undefined || total === undefined || time_taken_seconds === undefined) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const db = createServiceClient()

    const result: QuizResult = {
      user_id: user.userId,
      module: mod as Module,
      topic,
      score,
      total,
      time_taken_seconds,
    }

    const { error } = await db.from('quiz_results').insert(result)
    if (error) throw error

    // Update module_progress
    await db
      .from('module_progress')
      .upsert({
        user_id: user.userId,
        module: mod,
        topic,
        completed: true,
        score: Math.round((score / total) * 100),
      }, { onConflict: 'user_id,module,topic' })

    // Upsert progress aggregate
    const { data: progress } = await db
      .from('progress')
      .select('questions_attempted, avg_score, last_active')
      .eq('user_id', user.userId)
      .single()

    const oldAttempted = (progress?.questions_attempted as number) ?? 0
    const oldAvg = (progress?.avg_score as number) ?? 0
    const newAttempted = oldAttempted + total
    const newAvg = newAttempted === 0 ? 0 : Math.round(((oldAvg * oldAttempted) + (score / total * 100 * total)) / newAttempted)

    await db.from('progress').upsert({
      user_id: user.userId,
      questions_attempted: newAttempted,
      avg_score: newAvg,
      last_active: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to save quiz result.' }, { status: 500 })
  }
}

export async function GET() {
  const user = getServerUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = createServiceClient()
  const { data, error } = await db
    .from('quiz_results')
    .select('*')
    .eq('user_id', user.userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch quiz results.' }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
