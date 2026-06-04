import { NextRequest, NextResponse } from 'next/server'
import { signToken, getAuthCookieOptions, COOKIE_NAME } from '@/lib/auth'
import { DEMO_STUDENT_ID, TEACHER_ID } from '@/lib/mock-data'
import type { AuthPayload } from '@/lib/types'

// Mock auth — no database. Any non-empty code logs in.
// Code "teacher" → teacher dashboard. Anything else → shared demo student profile.
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { code?: string; username?: string }
    const raw = (body.code ?? body.username ?? '').trim()

    if (!raw) {
      return NextResponse.json({ error: 'Please enter an access code.' }, { status: 400 })
    }

    const isTeacher = raw.toLowerCase() === 'teacher'

    const payload: AuthPayload = isTeacher
      ? { userId: TEACHER_ID, username: 'teacher', role: 'teacher', name: 'Teacher' }
      : {
          userId: DEMO_STUDENT_ID,
          username: raw.toLowerCase(),
          role: 'student',
          track: 'psle',
          grade: 'P5',
          name: titleCase(raw),
        }

    const token = signToken(payload)

    const response = NextResponse.json({
      role: payload.role,
      name: payload.name,
      username: payload.username,
    })
    response.cookies.set(COOKIE_NAME, token, getAuthCookieOptions())
    return response
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}

function titleCase(s: string): string {
  return s
    .replace(/[-_]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}
