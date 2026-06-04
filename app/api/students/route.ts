import { NextRequest, NextResponse } from 'next/server'
import { getServerUser } from '@/lib/auth'
import { roster, type RosterStudent } from '@/lib/mock-data'
import { trackForGrade } from '@/lib/utils'

export async function GET() {
  const user = getServerUser()
  if (!user || user.role !== 'teacher') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const sorted = [...roster].sort((a, b) => a.name.localeCompare(b.name))
  return NextResponse.json(sorted)
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

    const uname = username.toLowerCase().trim()
    if (roster.some((s) => s.username === uname)) {
      return NextResponse.json({ error: 'Username already taken.' }, { status: 409 })
    }

    const newStudent: RosterStudent = {
      id: `stu-${Date.now()}`,
      username: uname,
      name,
      track: trackForGrade(grade),
      grade,
      created_at: new Date().toISOString(),
      progress: { questions_attempted: 0, avg_score: 0, papers_completed: 0, streak_days: 0, last_active: null },
    }
    roster.push(newStudent)

    return NextResponse.json(newStudent, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create student.' }, { status: 500 })
  }
}
