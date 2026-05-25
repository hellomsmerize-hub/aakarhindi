import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getServerUser } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { trackForGrade } from '@/lib/utils'

export async function GET() {
  const user = getServerUser()
  if (!user || user.role !== 'teacher') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const db = createServiceClient()
  const { data, error } = await db
    .from('users')
    .select(`
      id, username, name, track, grade, created_at,
      progress (
        questions_attempted, avg_score, papers_completed, streak_days, last_active
      )
    `)
    .eq('role', 'student')
    .order('name')

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch students.' }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  const user = getServerUser()
  if (!user || user.role !== 'teacher') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const body = (await request.json()) as {
      name?: string
      username?: string
      password?: string
      grade?: string
    }
    const { name, username, password, grade } = body

    if (!name || !username || !password || !grade) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
    }

    const db = createServiceClient()

    // Check if username exists
    const { data: existing } = await db
      .from('users')
      .select('id')
      .eq('username', username.toLowerCase().trim())
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Username already taken.' }, { status: 409 })
    }

    const password_hash = await bcrypt.hash(password, 12)
    const track = trackForGrade(grade)

    const { data: newUser, error } = await db
      .from('users')
      .insert({
        name,
        username: username.toLowerCase().trim(),
        password_hash,
        role: 'student',
        track,
        grade,
      })
      .select('id, username, name, track, grade')
      .single()

    if (error) throw error

    // Initialize progress
    await db.from('progress').insert({
      user_id: (newUser as { id: string }).id,
      questions_attempted: 0,
      avg_score: 0,
      papers_completed: 0,
      streak_days: 0,
      last_active: null,
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create student.' }, { status: 500 })
  }
}
