export type Role = 'student' | 'teacher'
export type Track = 'psle' | 'olevel'
export type Level = 'foundational' | 'advanced' | 'expert'
export type Module = 'grammar' | 'vocabulary' | 'comprehension' | 'writing'
export type QuestionType = 'mcq' | 'fib' | 'oe' | 'obj'

export interface User {
  id: string
  username: string
  role: Role
  track?: Track
  grade?: string
  name: string
  created_at: string
}

export interface AuthPayload {
  userId: string
  username: string
  role: Role
  track?: Track
  grade?: string
  name: string
}

export interface Progress {
  user_id: string
  questions_attempted: number
  avg_score: number
  papers_completed: number
  streak_days: number
  last_active: string
}

export interface QuizResult {
  user_id: string
  module: Module
  topic: string
  score: number
  total: number
  time_taken_seconds: number
  created_at?: string
}

export interface ExamResult {
  user_id: string
  paper_id: string
  score: number
  max_score: number
  time_taken_seconds: number
  answers_json: Record<string, number | string>
  oe_flagged: boolean
  created_at?: string
}

export interface ModuleProgress {
  user_id: string
  module: Module
  topic: string
  completed: boolean
  score: number | null
}

export interface Question {
  id: string
  type: QuestionType
  question: string
  context?: string
  options?: string[]
  correct?: number | string
  explanation: string
  explanation_en: string
  module: Module
  topic: string
  track: Track
  level: Level
  difficulty: 'easy' | 'medium' | 'hard'
  passage_id?: string   // for comprehension questions
  model_answer?: string // for OE questions
}

export interface ExamPaper {
  id: string
  title: string
  title_hindi: string
  track: Track
  level: Level
  year?: number
  time_minutes: number
  total_marks: number
  pass_mark: number
  sections: ExamSection[]
}

export interface ExamSection {
  id: string
  name: string
  name_hindi: string
  instructions?: string
  questions: Question[]
  marks: number
}

export interface Lesson {
  id: string
  title: string
  title_hindi: string
  module: Module
  topic: string
  track: Track
  level: Level
  content: LessonBlock[]
}

export interface LessonBlock {
  type: 'text' | 'hindi' | 'example' | 'table' | 'rule' | 'tip'
  content: string
  translation?: string
  note?: string
}

export interface StudentSummary {
  id: string
  username: string
  name: string
  track: Track
  grade: string
  last_active: string | null
  questions_attempted: number
  avg_score: number
  papers_completed: number
  streak_days: number
}
