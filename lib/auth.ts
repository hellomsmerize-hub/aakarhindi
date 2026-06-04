import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import type { AuthPayload } from './types'

// Fallback keeps the demo working when JWT_SECRET isn't set in the host env
// (e.g. Vercel, since .env.local is gitignored). Set JWT_SECRET in prod for real security.
const JWT_SECRET = process.env.JWT_SECRET || 'aakar-hindi-demo-fallback-secret-change-me-in-prod'
export const COOKIE_NAME = 'aakar_token'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload
  } catch {
    return null
  }
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: MAX_AGE,
    path: '/',
  }
}

export function getServerUser(): AuthPayload | null {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}
