/**
 * Tests for teacher students API routes (mock-data backed, no database):
 *   GET  /api/students
 *   POST /api/students
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockCookiesGet = vi.fn()
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({ get: mockCookiesGet })),
}))

const TEACHER_PAYLOAD = { userId: 'teacher-1', username: 'teacher', role: 'teacher' as const, name: 'Teacher' }
const STUDENT_PAYLOAD = { userId: 'student-demo', username: 'arjun', role: 'student' as const, name: 'Arjun', track: 'psle' as const, grade: 'P5' }
const TEACHER_TOKEN = 'valid.teacher.token'
const STUDENT_TOKEN = 'valid.student.token'

vi.mock('jsonwebtoken', () => {
  const verify = vi.fn((token: string) => {
    if (token === TEACHER_TOKEN) return TEACHER_PAYLOAD
    if (token === STUDENT_TOKEN) return STUDENT_PAYLOAD
    throw new Error('invalid token')
  })
  return { default: { sign: vi.fn(), verify }, sign: vi.fn(), verify }
})

import { GET, POST } from '@/app/api/students/route'

function setAuth(token: string | null) {
  mockCookiesGet.mockReturnValue(token ? { value: token } : undefined)
}
function makePostRequest(body: unknown) {
  return new Request('http://localhost/api/students', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('GET /api/students', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 200 with the seeded roster when called as teacher', async () => {
    setAuth(TEACHER_TOKEN)
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body.length).toBeGreaterThan(0)
    expect(body.some((s: { username: string }) => s.username === 'aarav')).toBe(true)
    expect(body[0].progress !== undefined).toBe(true)
  })

  it('returns 403 when called as a student', async () => {
    setAuth(STUDENT_TOKEN)
    const res = await GET()
    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toMatch(/forbidden/i)
  })

  it('returns 403 when called without authentication', async () => {
    setAuth(null)
    const res = await GET()
    expect(res.status).toBe(403)
  })
})

describe('POST /api/students', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 201 with the created student when teacher posts valid data', async () => {
    setAuth(TEACHER_TOKEN)
    const res = await POST(makePostRequest({
      name: 'New Student', username: 'New_Student', password: 'password123', grade: 'P5',
    }) as any)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.username).toBe('new_student') // lowercased
    expect(body.track).toBe('psle')
    expect(body.id).toBeTruthy()
  })

  it('returns 409 when the username already exists in the roster', async () => {
    setAuth(TEACHER_TOKEN)
    const res = await POST(makePostRequest({
      name: 'Duplicate', username: 'aarav', password: 'somepassword', grade: 'P5',
    }) as any)
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toMatch(/taken|exist|duplicate/i)
  })

  it('returns 400 when a required field is missing', async () => {
    setAuth(TEACHER_TOKEN)
    for (const body of [
      { username: 'x_user', password: 'password123', grade: 'P5' }, // no name
      { name: 'X', password: 'password123', grade: 'P5' },          // no username
      { name: 'X', username: 'x_user', grade: 'P5' },               // no password
      { name: 'X', username: 'x_user', password: 'password123' },   // no grade
    ]) {
      const res = await POST(makePostRequest(body) as any)
      expect(res.status).toBe(400)
    }
  })

  it('returns 400 when the password is too short', async () => {
    setAuth(TEACHER_TOKEN)
    const res = await POST(makePostRequest({
      name: 'X', username: 'short_pw', password: 'abc', grade: 'P5',
    }) as any)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/password/i)
  })

  it('returns 403 when called as a student', async () => {
    setAuth(STUDENT_TOKEN)
    const res = await POST(makePostRequest({
      name: 'X', username: 'y_user', password: 'password123', grade: 'P5',
    }) as any)
    expect(res.status).toBe(403)
  })

  it('returns 403 when not authenticated', async () => {
    setAuth(null)
    const res = await POST(makePostRequest({
      name: 'X', username: 'z_user', password: 'password123', grade: 'P5',
    }) as any)
    expect(res.status).toBe(403)
  })
})
