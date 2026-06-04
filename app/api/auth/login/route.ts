import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signToken, getAuthCookieOptions, COOKIE_NAME } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import type { AuthPayload, Role, Track } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { username?: string; password?: string }
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 })
    }

    const db = createServiceClient()
    const { data: user, error } = await db
      .from('users')
      .select('id, username, password_hash, role, track, grade, name')
      .eq('username', username.toLowerCase().trim())
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 })
    }

    const passwordHash = user.password_hash as string
    const valid = await bcrypt.compare(password, passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 })
    }

    const payload: AuthPayload = {
      userId: user.id as string,
      username: user.username as string,
      role: user.role as Role,
      track: user.track as Track | undefined,
      grade: user.grade as string | undefined,
      name: user.name as string,
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
