/**
 * Tests for auth API routes:
 *   POST /api/auth/login
 *   POST /api/auth/logout
 *   GET  /api/auth/me
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// Use vi.hoisted() so mock functions are available inside vi.mock() factories
// (vi.mock factories are hoisted to the top of the file by vitest)
// ---------------------------------------------------------------------------
const {
  mockSingle,
  mockEq,
  mockSelect,
  mockFrom,
  mockBcryptCompare,
  mockCookiesGet,
} = vi.hoisted(() => {
  const mockSingle = vi.fn()
  const mockEq = vi.fn(() => ({ single: mockSingle }))
  const mockSelect = vi.fn(() => ({ eq: mockEq }))
  const mockFrom = vi.fn(() => ({ select: mockSelect }))
  const mockBcryptCompare = vi.fn()
  const mockCookiesGet = vi.fn()
  return { mockSingle, mockEq, mockSelect, mockFrom, mockBcryptCompare, mockCookiesGet }
})

// ---------------------------------------------------------------------------
// Mock @/lib/supabase
// ---------------------------------------------------------------------------
vi.mock('@/lib/supabase', () => ({
  createServiceClient: vi.fn(() => ({ from: mockFrom })),
}))

// ---------------------------------------------------------------------------
// Mock bcryptjs
// ---------------------------------------------------------------------------
vi.mock('bcryptjs', () => ({
  default: { compare: mockBcryptCompare },
  compare: mockBcryptCompare,
}))

// ---------------------------------------------------------------------------
// Mock jsonwebtoken
// ---------------------------------------------------------------------------
const FAKE_TOKEN = 'fake.jwt.token'
const FAKE_PAYLOAD = {
  userId: 'user-uuid-001',
  username: 'teacher',
  role: 'teacher' as const,
  name: 'Aakar Teacher',
}

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(() => 'fake.jwt.token'),
    verify: vi.fn((token: string) => {
      if (token === 'fake.jwt.token') {
        return {
          userId: 'user-uuid-001',
          username: 'teacher',
          role: 'teacher',
          name: 'Aakar Teacher',
        }
      }
      throw new Error('invalid token')
    }),
  },
  sign: vi.fn(() => 'fake.jwt.token'),
  verify: vi.fn((token: string) => {
    if (token === 'fake.jwt.token') {
      return {
        userId: 'user-uuid-001',
        username: 'teacher',
        role: 'teacher',
        name: 'Aakar Teacher',
      }
    }
    throw new Error('invalid token')
  }),
}))

// ---------------------------------------------------------------------------
// Mock next/headers
// ---------------------------------------------------------------------------
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({ get: mockCookiesGet })),
}))

// ---------------------------------------------------------------------------
// Import route handlers AFTER all mocks are in place
// ---------------------------------------------------------------------------
import { POST as loginPOST } from '@/app/api/auth/login/route'
import { POST as logoutPOST } from '@/app/api/auth/logout/route'
import { GET as meGET } from '@/app/api/auth/me/route'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeRequest(method: string, body?: unknown): Request {
  return new Request('http://localhost/api/auth/login', {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
}

// ---------------------------------------------------------------------------
// Tests — POST /api/auth/login
// ---------------------------------------------------------------------------
describe('POST /api/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Re-wire chain after clearAllMocks since the chain fns are recreated
    mockEq.mockReturnValue({ single: mockSingle })
    mockSelect.mockReturnValue({ eq: mockEq })
    mockFrom.mockReturnValue({ select: mockSelect })
  })

  it('returns 200 and sets cookie on valid credentials', async () => {
    mockSingle.mockResolvedValueOnce({
      data: {
        id: FAKE_PAYLOAD.userId,
        username: FAKE_PAYLOAD.username,
        password_hash: '$2b$10$hashedpassword',
        role: FAKE_PAYLOAD.role,
        track: null,
        grade: null,
        name: FAKE_PAYLOAD.name,
      },
      error: null,
    })
    mockBcryptCompare.mockResolvedValueOnce(true)

    const req = makeRequest('POST', { username: 'teacher', password: 'aakar2026' })
    const res = await loginPOST(req as any)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.role).toBe('teacher')
    expect(body.username).toBe('teacher')
    expect(body.name).toBe('Aakar Teacher')

    const setCookie = res.headers.get('set-cookie')
    expect(setCookie).toBeTruthy()
    expect(setCookie).toContain('aakar_token')
    expect(setCookie).toContain(FAKE_TOKEN)
  })

  it('returns 401 when password is wrong', async () => {
    mockSingle.mockResolvedValueOnce({
      data: {
        id: 'some-id',
        username: 'teacher',
        password_hash: '$2b$10$wrong',
        role: 'teacher',
        track: null,
        grade: null,
        name: 'Aakar Teacher',
      },
      error: null,
    })
    mockBcryptCompare.mockResolvedValueOnce(false)

    const req = makeRequest('POST', { username: 'teacher', password: 'wrongpassword' })
    const res = await loginPOST(req as any)

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toMatch(/invalid/i)
  })

  it('returns 401 when user does not exist', async () => {
    mockSingle.mockResolvedValueOnce({
      data: null,
      error: { message: 'No rows found' },
    })

    const req = makeRequest('POST', { username: 'nobody', password: 'anything' })
    const res = await loginPOST(req as any)

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toMatch(/invalid/i)
  })

  it('returns 400 when username is missing', async () => {
    const req = makeRequest('POST', { password: 'aakar2026' })
    const res = await loginPOST(req as any)

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })

  it('returns 400 when password is missing', async () => {
    const req = makeRequest('POST', { username: 'teacher' })
    const res = await loginPOST(req as any)

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })

  it('returns 400 when body is empty', async () => {
    const req = makeRequest('POST', {})
    const res = await loginPOST(req as any)

    expect(res.status).toBe(400)
  })
})

// ---------------------------------------------------------------------------
// Tests — POST /api/auth/logout
// ---------------------------------------------------------------------------
describe('POST /api/auth/logout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 and clears the auth cookie', async () => {
    const res = await logoutPOST()

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)

    const setCookie = res.headers.get('set-cookie')
    expect(setCookie).toBeTruthy()
    expect(setCookie).toContain('aakar_token')

    // Cookie cleared: either maxAge=0 or empty value
    const hasMaxAgeZero = setCookie!.toLowerCase().includes('max-age=0')
    const hasEmptyValue =
      setCookie!.includes('aakar_token=;') || setCookie!.includes('aakar_token=""')
    expect(hasMaxAgeZero || hasEmptyValue).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// Tests — GET /api/auth/me
// ---------------------------------------------------------------------------
describe('GET /api/auth/me', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 with user payload when token is valid', async () => {
    mockCookiesGet.mockReturnValueOnce({ value: FAKE_TOKEN })

    const res = await meGET()

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.userId).toBe(FAKE_PAYLOAD.userId)
    expect(body.username).toBe(FAKE_PAYLOAD.username)
    expect(body.role).toBe(FAKE_PAYLOAD.role)
    expect(body.name).toBe(FAKE_PAYLOAD.name)
  })

  it('returns 401 when no token cookie is present', async () => {
    mockCookiesGet.mockReturnValueOnce(undefined)

    const res = await meGET()

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toMatch(/unauthorized/i)
  })

  it('returns 401 when token is invalid or expired', async () => {
    mockCookiesGet.mockReturnValueOnce({ value: 'bad.token.here' })

    const res = await meGET()

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toMatch(/unauthorized/i)
  })
})
