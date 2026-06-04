/**
 * Tests for auth API routes (mock auth — no database):
 *   POST /api/auth/login   (single access code)
 *   POST /api/auth/logout
 *   GET  /api/auth/me
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockCookiesGet } = vi.hoisted(() => ({ mockCookiesGet: vi.fn() }))

const FAKE_TOKEN = 'fake.jwt.token'

vi.mock('jsonwebtoken', () => {
  const sign = vi.fn(() => FAKE_TOKEN)
  const verify = vi.fn((token: string) => {
    if (token === FAKE_TOKEN) {
      return { userId: 'teacher-1', username: 'teacher', role: 'teacher', name: 'Teacher' }
    }
    throw new Error('invalid token')
  })
  return { default: { sign, verify }, sign, verify }
})

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({ get: mockCookiesGet })),
}))

import { POST as loginPOST } from '@/app/api/auth/login/route'
import { POST as logoutPOST } from '@/app/api/auth/logout/route'
import { GET as meGET } from '@/app/api/auth/me/route'

function makeRequest(body?: unknown): Request {
  return new Request('http://localhost/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

describe('POST /api/auth/login (mock code auth)', () => {
  beforeEach(() => vi.clearAllMocks())

  it('logs in the teacher when code is "teacher"', async () => {
    const res = await loginPOST(makeRequest({ code: 'teacher' }) as any)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.role).toBe('teacher')
    expect(body.username).toBe('teacher')

    const setCookie = res.headers.get('set-cookie')
    expect(setCookie).toContain('aakar_token')
    expect(setCookie).toContain(FAKE_TOKEN)
  })

  it('logs in any other code as a student with a titlecased name', async () => {
    const res = await loginPOST(makeRequest({ code: 'arjun' }) as any)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.role).toBe('student')
    expect(body.name).toBe('Arjun')
  })

  it('still accepts the legacy { username } field', async () => {
    const res = await loginPOST(makeRequest({ username: 'teacher' }) as any)
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.role).toBe('teacher')
  })

  it('returns 400 when the code is empty', async () => {
    const res = await loginPOST(makeRequest({ code: '   ' }) as any)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })

  it('returns 400 when the body has no code', async () => {
    const res = await loginPOST(makeRequest({}) as any)
    expect(res.status).toBe(400)
  })
})

describe('POST /api/auth/logout', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 200 and clears the auth cookie', async () => {
    const res = await logoutPOST()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)

    const setCookie = res.headers.get('set-cookie')
    expect(setCookie).toBeTruthy()
    expect(setCookie).toContain('aakar_token')
    const hasMaxAgeZero = setCookie!.toLowerCase().includes('max-age=0')
    const hasEmptyValue =
      setCookie!.includes('aakar_token=;') || setCookie!.includes('aakar_token=""')
    expect(hasMaxAgeZero || hasEmptyValue).toBe(true)
  })
})

describe('GET /api/auth/me', () => {
  beforeEach(() => vi.clearAllMocks())

  it('returns 200 with the user payload when the token is valid', async () => {
    mockCookiesGet.mockReturnValueOnce({ value: FAKE_TOKEN })
    const res = await meGET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.role).toBe('teacher')
    expect(body.username).toBe('teacher')
  })

  it('returns 401 when no token cookie is present', async () => {
    mockCookiesGet.mockReturnValueOnce(undefined)
    const res = await meGET()
    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toMatch(/unauthorized/i)
  })

  it('returns 401 when the token is invalid', async () => {
    mockCookiesGet.mockReturnValueOnce({ value: 'bad.token.here' })
    const res = await meGET()
    expect(res.status).toBe(401)
  })
})
