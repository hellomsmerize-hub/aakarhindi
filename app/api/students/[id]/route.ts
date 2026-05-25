import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getServerUser } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getServerUser()
  if (!user || user.role !== 'teacher') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const db = createServiceClient()
  const { data: student, error } = await db
    .from('users')
    .select(`
      id, username, name, track, grade, created_at,
      progress (
        questions_attempted, avg_score, papers_completed, streak_days, last_active
      )
    `)
    .eq('id', params.id)
    .eq('role', 'student')
    .single()

  if (error || !student) {
    return NextResponse.json({ error: 'Student not found.' }, { status: 404 })
  }

  const [quizResults, examResults, moduleProgress] = await Promise.all([
    db.from('quiz_results').select('*').eq('user_id', params.id).order('created_at', { ascending: false }).limit(20),
    db.from('exam_results').select('*').eq('user_id', params.id).order('created_at', { ascending: false }).limit(10),
    db.from('module_progress').select('*').eq('user_id', params.id),
  ])

  return NextResponse.json({
    student,
    quizResults: quizResults.data ?? [],
    examResults: examResults.data ?? [],
    moduleProgress: moduleProgress.data ?? [],
  })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = getServerUser()
  if (!user || user.role !== 'teacher') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = (await request.json()) as { password?: string }
    const { password } = body

    if (!password || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
    }

    const password_hash = await bcrypt.hash(password, 12)
    const db = createServiceClient()

    const { error } = await db
      .from('users')
      .update({ password_hash })
      .eq('id', params.id)
      .eq('role', 'student')

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update password.' }, { status: 500 })
  }
}
