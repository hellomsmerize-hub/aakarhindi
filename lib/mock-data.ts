// In-memory mock data store — replaces Supabase for the no-backend client demo.
// All student logins share one populated demo profile (DEMO_STUDENT_ID) so any
// access code lands on a rich dashboard. Live quiz/exam writes append here and
// show up immediately (resets on server restart).

import type { QuizResult, ExamResult, ModuleProgress, Progress } from './types'

export const DEMO_STUDENT_ID = 'student-demo'
export const TEACHER_ID = 'teacher-1'

const now = Date.now()
const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString()
const daysAgo = (d: number) => new Date(now - d * 86400_000).toISOString()

// ── progress aggregate (one row per user_id) ────────────────────────────────
export const progressTable: (Progress & { user_id: string })[] = [
  {
    user_id: DEMO_STUDENT_ID,
    questions_attempted: 142,
    avg_score: 78,
    papers_completed: 4,
    streak_days: 5,
    last_active: hoursAgo(3),
  },
]

// ── quiz history (quiz_history ≡ quiz_results) ──────────────────────────────
export const quizTable: (QuizResult & { user_id: string })[] = [
  { user_id: DEMO_STUDENT_ID, module: 'grammar', topic: 'verbs', score: 9, total: 10, time_taken_seconds: 240, created_at: hoursAgo(3) },
  { user_id: DEMO_STUDENT_ID, module: 'vocabulary', topic: 'synonyms', score: 8, total: 10, time_taken_seconds: 300, created_at: hoursAgo(28) },
  { user_id: DEMO_STUDENT_ID, module: 'grammar', topic: 'nouns', score: 7, total: 10, time_taken_seconds: 210, created_at: daysAgo(2) },
  { user_id: DEMO_STUDENT_ID, module: 'comprehension', topic: 'factual', score: 6, total: 8, time_taken_seconds: 360, created_at: daysAgo(3) },
  { user_id: DEMO_STUDENT_ID, module: 'vocabulary', topic: 'idioms', score: 9, total: 10, time_taken_seconds: 180, created_at: daysAgo(4) },
  { user_id: DEMO_STUDENT_ID, module: 'grammar', topic: 'pronouns', score: 8, total: 10, time_taken_seconds: 200, created_at: daysAgo(5) },
]

// ── exam history (exam_history ≡ exam_results) ──────────────────────────────
export const examTable: (ExamResult & { user_id: string })[] = [
  { user_id: DEMO_STUDENT_ID, paper_id: 'psle-2024-p2', score: 62, max_score: 80, time_taken_seconds: 5400, answers_json: {}, oe_flagged: false, created_at: daysAgo(2) },
  { user_id: DEMO_STUDENT_ID, paper_id: 'psle-2023-p2', score: 55, max_score: 80, time_taken_seconds: 5800, answers_json: {}, oe_flagged: true, created_at: daysAgo(6) },
  { user_id: DEMO_STUDENT_ID, paper_id: 'psle-2022-p2', score: 68, max_score: 80, time_taken_seconds: 5100, answers_json: {}, oe_flagged: false, created_at: daysAgo(9) },
]

// ── module_progress (per topic) ─────────────────────────────────────────────
export const moduleProgressTable: (ModuleProgress & { user_id: string })[] = [
  { user_id: DEMO_STUDENT_ID, module: 'grammar', topic: 'nouns', completed: true, score: 70 },
  { user_id: DEMO_STUDENT_ID, module: 'grammar', topic: 'verbs', completed: true, score: 90 },
  { user_id: DEMO_STUDENT_ID, module: 'grammar', topic: 'pronouns', completed: true, score: 80 },
  { user_id: DEMO_STUDENT_ID, module: 'vocabulary', topic: 'synonyms', completed: true, score: 80 },
  { user_id: DEMO_STUDENT_ID, module: 'vocabulary', topic: 'idioms', completed: true, score: 90 },
  { user_id: DEMO_STUDENT_ID, module: 'comprehension', topic: 'factual', completed: true, score: 75 },
]

// ── teacher roster (used directly by /api/students routes) ───────────────────
export interface RosterStudent {
  id: string
  username: string
  name: string
  track: 'psle' | 'olevel'
  grade: string
  created_at: string
  progress: {
    questions_attempted: number
    avg_score: number
    papers_completed: number
    streak_days: number
    last_active: string | null
  } | null
}

export const roster: RosterStudent[] = [
  { id: 'stu-1', username: 'aarav', name: 'Aarav Sharma', track: 'psle', grade: 'P5', created_at: daysAgo(120), progress: { questions_attempted: 142, avg_score: 78, papers_completed: 4, streak_days: 5, last_active: hoursAgo(3) } },
  { id: 'stu-2', username: 'diya', name: 'Diya Nair', track: 'psle', grade: 'P6', created_at: daysAgo(90), progress: { questions_attempted: 210, avg_score: 85, papers_completed: 7, streak_days: 12, last_active: hoursAgo(20) } },
  { id: 'stu-3', username: 'kabir', name: 'Kabir Menon', track: 'psle', grade: 'P4', created_at: daysAgo(60), progress: { questions_attempted: 64, avg_score: 62, papers_completed: 1, streak_days: 2, last_active: daysAgo(2) } },
  { id: 'stu-4', username: 'ananya', name: 'Ananya Iyer', track: 'olevel', grade: 'Sec 2', created_at: daysAgo(150), progress: { questions_attempted: 320, avg_score: 81, papers_completed: 9, streak_days: 8, last_active: hoursAgo(5) } },
  { id: 'stu-5', username: 'vihaan', name: 'Vihaan Rao', track: 'olevel', grade: 'Sec 3', created_at: daysAgo(45), progress: { questions_attempted: 98, avg_score: 70, papers_completed: 3, streak_days: 0, last_active: daysAgo(4) } },
  { id: 'stu-6', username: 'meera', name: 'Meera Pillai', track: 'olevel', grade: 'Sec 4', created_at: daysAgo(30), progress: null },
]

// Detail payloads keyed by roster id (quiz/exam/module history per student).
export function rosterDetail(id: string) {
  const student = roster.find((s) => s.id === id)
  if (!student) return null
  // Reuse the demo profile's history for any roster student (good enough for demo).
  const quizResults: QuizResult[] = quizTable.map((q) => ({ ...q }))
  const examResults: ExamResult[] = examTable.map((e) => ({ ...e }))
  const moduleProgress: ModuleProgress[] = moduleProgressTable.map((m) => ({ ...m }))
  return { student, quizResults, examResults, moduleProgress }
}
