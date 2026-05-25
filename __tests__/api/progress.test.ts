/**
 * Tests for progress API routes:
 *   POST /api/progress/quiz
 *   POST /api/progress/exam
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'

// ---------------------------------------------------------------------------
// Mock next/headers — we control auth state via mockCookiesGet
// ---------------------------------------------------------------------------
const mockCookiesGet = vi.fn()
vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({ get: mockCookiesGet })),
}))

// ---------------------------------------------------------------------------
// Mock jsonwebtoken
// ---------------------------------------------------------------------------
const STUDENT_PAYLOAD = {
  userId: 'student-uuid-001',
  username: 'priya_p5',
  role: 'student' as const,
  name: 'Priya Sharma',
  track: 'psle' as const,
  grade: 'P5',
}
const VALID_TOKEN = 'valid.student.token'

vi.mock('jsonwebtoken', () => ({
  default: {
    sign: vi.fn(() => VALID_TOKEN),
    verify: vi.fn((token: string) => {
      if (token === VALID_TOKEN) return STUDENT_PAYLOAD
      throw new Error('invalid token')
    }),
  },
  sign: vi.fn(() => VALID_TOKEN),
  verify: vi.fn((token: string) => {
    if (token === VALID_TOKEN) return STUDENT_PAYLOAD
    throw new Error('invalid token')
  }),
}))

// ---------------------------------------------------------------------------
// Mock @/lib/supabase — we expose individual mock functions per operation
// so each test can configure the chain independently.
// ---------------------------------------------------------------------------
const mockInsert = vi.fn()
const mockUpsert = vi.fn()
const mockRpcFn = vi.fn()

// We need the select chain for the progress aggregate fetch
const mockProgressSingle = vi.fn()
const mockProgressEq = vi.fn(() => ({ single: mockProgressSingle }))
const mockProgressSelect = vi.fn(() => ({ eq: mockProgressEq }))

// from() returns different objects depending on the table name
const mockFrom = vi.fn((table: string) => {
  if (table === 'progress') {
    return {
      select: mockProgressSelect,
      upsert: mockUpsert,
      insert: mockInsert,
    }
  }
  return {
    insert: mockInsert,
    upsert: mockUpsert,
    select: mockProgressSelect,
  }
})

vi.mock('@/lib/supabase', () => ({
  createServiceClient: vi.fn(() => ({
    from: mockFrom,
    rpc: mockRpcFn,
  })),
}))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function makeAuthenticatedRequest(body: unknown): Request {
  return new Request('http://localhost/api/progress/quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function setAuthCookie(token: string | null) {
  if (token) {
    mockCookiesGet.mockReturnValue({ value: token })
  } else {
    mockCookiesGet.mockReturnValue(undefined)
  }
}

// ---------------------------------------------------------------------------
// Import route handlers AFTER mocks
// ---------------------------------------------------------------------------
import { POST as quizPOST } from '@/app/api/progress/quiz/route'
import { POST as examPOST } from '@/app/api/progress/exam/route'

// ---------------------------------------------------------------------------
// Quiz Tests
// ---------------------------------------------------------------------------
describe('POST /api/progress/quiz', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 201 and saves result when payload is valid', async () => {
    setAuthCookie(VALID_TOKEN)

    // quiz_results insert succeeds
    mockInsert.mockResolvedValue({ error: null })
    // module_progress upsert succeeds
    mockUpsert.mockResolvedValue({ error: null })
    // progress select returns existing row
    mockProgressSingle.mockResolvedValue({
      data: { questions_attempted: 50, avg_score: 70, last_active: '2026-05-20' },
      error: null,
    })

    const req = makeAuthenticatedRequest({
      module: 'grammar',
      topic: 'tenses',
      score: 8,
      total: 10,
      time_taken_seconds: 360,
    })

    const res = await quizPOST(req as any)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)

    // insert should have been called with quiz data
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: STUDENT_PAYLOAD.userId,
        module: 'grammar',
        topic: 'tenses',
        score: 8,
        total: 10,
        time_taken_seconds: 360,
      })
    )

    // module_progress upsert should have been called
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: STUDENT_PAYLOAD.userId,
        module: 'grammar',
        topic: 'tenses',
        completed: true,
      }),
      expect.objectContaining({ onConflict: 'user_id,module,topic' })
    )
  })

  it('returns 401 when no auth token is present', async () => {
    setAuthCookie(null)

    const req = makeAuthenticatedRequest({
      module: 'grammar',
      topic: 'tenses',
      score: 8,
      total: 10,
      time_taken_seconds: 360,
    })

    const res = await quizPOST(req as any)

    expect(res.status).toBe(401)
    const body = await res.json()
    expect(body.error).toMatch(/unauthorized/i)
  })

  it('returns 400 when module is missing', async () => {
    setAuthCookie(VALID_TOKEN)

    const req = makeAuthenticatedRequest({
      topic: 'tenses',
      score: 8,
      total: 10,
      time_taken_seconds: 360,
    })

    const res = await quizPOST(req as any)

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeTruthy()
  })

  it('returns 400 when topic is missing', async () => {
    setAuthCookie(VALID_TOKEN)

    const req = makeAuthenticatedRequest({
      module: 'grammar',
      score: 8,
      total: 10,
      time_taken_seconds: 360,
    })

    const res = await quizPOST(req as any)

    expect(res.status).toBe(400)
  })

  it('returns 400 when score is missing', async () => {
    setAuthCookie(VALID_TOKEN)

    const req = makeAuthenticatedRequest({
      module: 'grammar',
      topic: 'tenses',
      total: 10,
      time_taken_seconds: 360,
    })

    const res = await quizPOST(req as any)

    expect(res.status).toBe(400)
  })

  it('returns 400 when total is missing', async () => {
    setAuthCookie(VALID_TOKEN)

    const req = makeAuthenticatedRequest({
      module: 'vocabulary',
      topic: 'synonyms',
      score: 5,
      time_taken_seconds: 200,
    })

    const res = await quizPOST(req as any)

    expect(res.status).toBe(400)
  })

  it('returns 400 when time_taken_seconds is missing', async () => {
    setAuthCookie(VALID_TOKEN)

    const req = makeAuthenticatedRequest({
      module: 'vocabulary',
      topic: 'synonyms',
      score: 5,
      total: 10,
    })

    const res = await quizPOST(req as any)

    expect(res.status).toBe(400)
  })
})

// ---------------------------------------------------------------------------
// Exam Tests
// ---------------------------------------------------------------------------
describe('POST /api/progress/exam', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 200 and sets oe_flagged=false for MCQ-only exam', async () => {
    setAuthCookie(VALID_TOKEN)

    mockInsert.mockResolvedValue({ error: null })
    mockRpcFn.mockResolvedValue({ error: null })

    const req = new Request('http://localhost/api/progress/exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paper_id: 'psle-2023-paper1',
        score: 38,
        max_score: 50,
        time_taken_seconds: 2700,
        answers_json: { q1: 2, q2: 0, q3: 1, q4: 3, q5: 1 },
        oe_flagged: false,
      }),
    })

    const res = await examPOST(req as any)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: STUDENT_PAYLOAD.userId,
        paper_id: 'psle-2023-paper1',
        score: 38,
        max_score: 50,
        oe_flagged: false,
      })
    )
  })

  it('returns 200 and sets oe_flagged=true for exam with open-ended sections', async () => {
    setAuthCookie(VALID_TOKEN)

    mockInsert.mockResolvedValue({ error: null })
    mockRpcFn.mockResolvedValue({ error: null })

    const req = new Request('http://localhost/api/progress/exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paper_id: 'psle-2023-paper2',
        score: 22,
        max_score: 30,
        time_taken_seconds: 3600,
        answers_json: {
          q1: 1,
          q2: 0,
          oe1: 'राम एक अच्छा लड़का है।',
          oe2: 'मैं रोज स्कूल जाता हूँ।',
        },
        oe_flagged: true,
      }),
    })

    const res = await examPOST(req as any)

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: STUDENT_PAYLOAD.userId,
        paper_id: 'psle-2023-paper2',
        oe_flagged: true,
      })
    )
  })

  it('returns 401 when not authenticated', async () => {
    setAuthCookie(null)

    const req = new Request('http://localhost/api/progress/exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paper_id: 'psle-2023-paper1',
        score: 38,
        max_score: 50,
        time_taken_seconds: 2700,
        answers_json: { q1: 2 },
        oe_flagged: false,
      }),
    })

    const res = await examPOST(req as any)

    expect(res.status).toBe(401)
  })

  it('returns 400 when paper_id is missing', async () => {
    setAuthCookie(VALID_TOKEN)

    const req = new Request('http://localhost/api/progress/exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        score: 38,
        max_score: 50,
        time_taken_seconds: 2700,
        answers_json: { q1: 2 },
      }),
    })

    const res = await examPOST(req as any)

    expect(res.status).toBe(400)
  })

  it('returns 400 when answers_json is missing', async () => {
    setAuthCookie(VALID_TOKEN)

    const req = new Request('http://localhost/api/progress/exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paper_id: 'psle-2023-paper1',
        score: 38,
        max_score: 50,
        time_taken_seconds: 2700,
      }),
    })

    const res = await examPOST(req as any)

    expect(res.status).toBe(400)
  })

  it('calls increment_papers_completed RPC on success', async () => {
    setAuthCookie(VALID_TOKEN)

    mockInsert.mockResolvedValue({ error: null })
    mockRpcFn.mockResolvedValue({ error: null })

    const req = new Request('http://localhost/api/progress/exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paper_id: 'psle-2022-paper1',
        score: 45,
        max_score: 50,
        time_taken_seconds: 2400,
        answers_json: { q1: 0, q2: 2 },
        oe_flagged: false,
      }),
    })

    await examPOST(req as any)

    expect(mockRpcFn).toHaveBeenCalledWith('increment_papers_completed', {
      p_user_id: STUDENT_PAYLOAD.userId,
    })
  })
})
