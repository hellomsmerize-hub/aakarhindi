/**
 * Tests for teacher students API routes:
 *   GET  /api/students
 *   POST /api/students
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// Mock next/headers — controls which user is "logged in"
// ---------------------------------------------------------------------------
const mockCookiesGet = vi.fn()
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({ get: mockCookiesGet })),
}))

// ---------------------------------------------------------------------------
// Mock jsonwebtoken
// ---------------------------------------------------------------------------
const TEACHER_PAYLOAD = {
  userId: 'teacher-uuid-001',
  username: 'teacher',
  role: 'teacher' as const,
  name: 'Aakar Teacher',
}
const STUDENT_PAYLOAD = {
  userId: 'student-uuid-001',
  username: 'priya_p5',
  role: 'student' as const,
  name: 'Priya Sharma',
  track: 'psle' as const,
  grade: 'P5',
}
const TEACHER_TOKEN = 'valid.teacher.token'
const STUDENT_TOKEN = 'valid.student.token'

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(),
    verify: vi.fn((token: string) => {
      if (token === TEACHER_TOKEN) return TEACHER_PAYLOAD
      if (token === STUDENT_TOKEN) return STUDENT_PAYLOAD
      throw new Error('invalid token')
    }),
  },
  sign: vi.fn(),
  verify: vi.fn((token: string) => {
    if (token === TEACHER_TOKEN) return TEACHER_PAYLOAD
    if (token === STUDENT_TOKEN) return STUDENT_PAYLOAD
    throw new Error('invalid token')
  }),
}))

// ---------------------------------------------------------------------------
// Mock bcryptjs
// ---------------------------------------------------------------------------
vi.mock('bcryptjs', () => ({
  default: { hash: vi.fn(async () => '$2b$12$hashedpasswordvalue') },
  hash: vi.fn(async () => '$2b$12$hashedpasswordvalue'),
}))

// ---------------------------------------------------------------------------
// Mock @/lib/supabase
// ---------------------------------------------------------------------------
const mockOrder = vi.fn()
const mockEqForSelect = vi.fn(() => ({ order: mockOrder }))
const mockSelectForList = vi.fn(() => ({ eq: mockEqForSelect }))

// For username existence check (single)
const mockExistingSingle = vi.fn()
const mockExistingEq = vi.fn(() => ({ single: mockExistingSingle }))
const mockExistingSelect = vi.fn(() => ({ eq: mockExistingEq }))

// For insert new user
const mockInsertSelect = vi.fn()
const mockInsertSingle = vi.fn()
const mockInsertChain = vi.fn(() => ({ select: mockInsertSelect }))

// For progress insert
const mockProgressInsert = vi.fn()

// Configurable from() dispatch
const mockFrom = vi.fn()

vi.mock('@/lib/supabase', () => ({
  createServiceClient: vi.fn(() => ({ from: mockFrom })),
}))

// ---------------------------------------------------------------------------
// Mock @/lib/utils (trackForGrade helper)
// ---------------------------------------------------------------------------
vi.mock('@/lib/utils', () => ({
  trackForGrade: vi.fn((grade: string) => {
    if (grade.startsWith('P')) return 'psle'
    if (grade.startsWith('Sec')) return 'olevel'
    return 'psle'
  }),
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function setAuth(token: string | null) {
  if (token) {
    mockCookiesGet.mockReturnValue({ value: token })
  } else {
    mockCookiesGet.mockReturnValue(undefined)
  }
}

// ---------------------------------------------------------------------------
// Import route handler AFTER mocks
// ---------------------------------------------------------------------------
import { GET, POST } from '@/app/api/students/route'

// ---------------------------------------------------------------------------
// Sample students data
// ---------------------------------------------------------------------------
const SAMPLE_STUDENTS = [
  {
    id: 'student-uuid-001',
    username: 'priya_p5',
    name: 'Priya Sharma',
    track: 'psle',
    grade: 'P5',
    created_at: '2026-01-01T00:00:00Z',
    progress: {
      questions_attempted: 120,
      avg_score: 72.5,
      papers_completed: 3,
      streak_days: 5,
      last_active: '2026-05-25',
    },
  },
  {
    id: 'student-uuid-002',
    username: 'arjun_p6',
    name: 'Arjun Patel',
    track: 'psle',
    grade: 'P6',
    created_at: '2026-01-02T00:00:00Z',
    progress: {
      questions_attempted: 245,
      avg_score: 84.0,
      papers_completed: 7,
      streak_days: 12,
      last_active: '2026-05-25',
    },
  },
]

// ---------------------------------------------------------------------------
// GET /api/students tests
// ---------------------------------------------------------------------------
describe('GET /api/students', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 with list of students when called as teacher', async () => {
    setAuth(TEACHER_TOKEN)

    mockOrder.mockResolvedValueOnce({ data: SAMPLE_STUDENTS, error: null })
    mockFrom.mockReturnValue({ select: mockSelectForList })

    const res = await GET()

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
    expect(body).toHaveLength(2)
    expect(body[0].username).toBe('priya_p5')
    expect(body[1].username).toBe('arjun_p6')
    // Progress should be included
    expect(body[0].progress).toBeDefined()
    expect(body[0].progress.questions_attempted).toBe(120)
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

  it('returns empty array when no students exist', async () => {
    setAuth(TEACHER_TOKEN)

    mockOrder.mockResolvedValueOnce({ data: [], error: null })
    mockFrom.mockReturnValue({ select: mockSelectForList })

    const res = await GET()

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// POST /api/students tests
// ---------------------------------------------------------------------------
describe('POST /api/students', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function makePostRequest(body: unknown) {
    return new Request('http://localhost/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }

  it('returns 201 with created student when teacher posts valid data', async () => {
    setAuth(TEACHER_TOKEN)

    const newStudentId = 'new-student-uuid-999'

    // Sequence of from() calls:
    // 1. Check existing username → returns null (user does not exist)
    // 2. Insert new user → returns new user data
    // 3. Insert progress → success

    let callCount = 0
    mockFrom.mockImplementation((table: string) => {
      callCount++
      if (callCount === 1) {
        // Existence check
        return { select: mockExistingSelect }
      }
      if (callCount === 2) {
        // Insert user
        return {
          insert: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(async () => ({
                data: {
                  id: newStudentId,
                  username: 'new_student',
                  name: 'New Student',
                  track: 'psle',
                  grade: 'P5',
                },
                error: null,
              })),
            })),
          })),
        }
      }
      // Progress insert
      return { insert: vi.fn(async () => ({ error: null })) }
    })

    mockExistingSingle.mockResolvedValueOnce({ data: null, error: { message: 'Not found' } })

    const req = makePostRequest({
      name: 'New Student',
      username: 'new_student',
      password: 'password123',
      grade: 'P5',
    })

    const res = await POST(req as any)

    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.username).toBe('new_student')
    expect(body.id).toBe(newStudentId)
  })

  it('returns 409 when username already exists', async () => {
    setAuth(TEACHER_TOKEN)

    // Existence check returns an existing user
    mockFrom.mockReturnValue({ select: mockExistingSelect })
    mockExistingSingle.mockResolvedValueOnce({
      data: { id: 'existing-uuid' },
      error: null,
    })

    const req = makePostRequest({
      name: 'Duplicate User',
      username: 'priya_p5',
      password: 'somepassword',
      grade: 'P5',
    })

    const res = await POST(req as any)

    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error).toMatch(/taken|exist|duplicate/i)
  })

  it('returns 400 when name is missing', async () => {
    setAuth(TEACHER_TOKEN)

    const req = makePostRequest({
      username: 'new_student',
      password: 'password123',
      grade: 'P5',
    })

    const res = await POST(req as any)

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })

  it('returns 400 when username is missing', async () => {
    setAuth(TEACHER_TOKEN)

    const req = makePostRequest({
      name: 'New Student',
      password: 'password123',
      grade: 'P5',
    })

    const res = await POST(req as any)

    expect(res.status).toBe(400)
  })

  it('returns 400 when password is missing', async () => {
    setAuth(TEACHER_TOKEN)

    const req = makePostRequest({
      name: 'New Student',
      username: 'new_student',
      grade: 'P5',
    })

    const res = await POST(req as any)

    expect(res.status).toBe(400)
  })

  it('returns 400 when grade is missing', async () => {
    setAuth(TEACHER_TOKEN)

    const req = makePostRequest({
      name: 'New Student',
      username: 'new_student',
      password: 'password123',
    })

    const res = await POST(req as any)

    expect(res.status).toBe(400)
  })

  it('returns 403 when called as a student', async () => {
    setAuth(STUDENT_TOKEN)

    const req = makePostRequest({
      name: 'New Student',
      username: 'new_student',
      password: 'password123',
      grade: 'P5',
    })

    const res = await POST(req as any)

    expect(res.status).toBe(403)
    const body = await res.json()
    expect(body.error).toMatch(/forbidden/i)
  })

  it('returns 403 when not authenticated', async () => {
    setAuth(null)

    const req = makePostRequest({
      name: 'New Student',
      username: 'new_student',
      password: 'password123',
      grade: 'P5',
    })

    const res = await POST(req as any)

    expect(res.status).toBe(403)
  })

  it('returns 400 when password is too short', async () => {
    setAuth(TEACHER_TOKEN)

    const req = makePostRequest({
      name: 'New Student',
      username: 'new_student',
      password: 'abc',
      grade: 'P5',
    })

    const res = await POST(req as any)

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/password/i)
  })
})
