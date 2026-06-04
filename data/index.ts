// ─── PSLE Content ──────────────────────────────────────────────────────────
export { psleGrammarQuestions } from './psle/grammar'
export { psleVocabularyQuestions } from './psle/vocabulary'
export { psleComprehensionQuestions, psleComprehensionPassages } from './psle/comprehension'
export { psleWritingTopics, psleWritingLessons } from './psle/writing'
export { psleLessons } from './psle/lessons'

// ─── O-Level Content ────────────────────────────────────────────────────────
export { olevelGrammarQuestions } from './olevel/grammar'
export { olevel_vocabulary as olevelVocabularyQuestions } from './olevel/vocabulary'
export { olevel_comprehension as olevelComprehensionQuestions, olevel_passages as olevelPassages } from './olevel/comprehension'
export { olevel_writing_topics as olevelWritingTopics, olevel_letter_formats as olevelLetterFormats } from './olevel/writing'
export { olevel_lessons as olevelLessons } from './olevel/lessons'

// ─── Exam Papers ────────────────────────────────────────────────────────────
export { examPapers, getExamPaper, getExamPapersByTrack } from './exam-papers'

// ─── Helpers ────────────────────────────────────────────────────────────────
import type { Question, Module, Track, Level, Lesson } from '@/lib/types'
import { psleGrammarQuestions } from './psle/grammar'
import { psleVocabularyQuestions } from './psle/vocabulary'
import { psleComprehensionQuestions } from './psle/comprehension'
import { olevelGrammarQuestions } from './olevel/grammar'
import { olevel_vocabulary } from './olevel/vocabulary'
import { olevel_comprehension } from './olevel/comprehension'
import { psleLessons } from './psle/lessons'
import { olevel_lessons } from './olevel/lessons'

const ALL_QUESTIONS: Question[] = [
  ...psleGrammarQuestions,
  ...psleVocabularyQuestions,
  ...psleComprehensionQuestions,
  ...olevelGrammarQuestions,
  ...olevel_vocabulary,
  ...olevel_comprehension,
]

const ALL_LESSONS: Lesson[] = [
  ...psleLessons,
  ...olevel_lessons,
]

/** Get questions filtered by track, module, and optionally topic + level */
export function getQuestions(
  track: Track,
  module: Module,
  topic?: string,
  level?: Level,
  limit = 10,
): Question[] {
  let qs = ALL_QUESTIONS.filter((q) => q.track === track && q.module === module)
  if (topic) qs = qs.filter((q) => q.topic === topic)
  if (level) qs = qs.filter((q) => q.level === level)
  // Shuffle deterministically by topic string
  const seed = (topic ?? module).split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return [...qs].sort((a, b) => Math.sin(seed + a.id.length) - Math.sin(seed + b.id.length)).slice(0, limit)
}

/** Get lesson by topic + track */
export function getLesson(topic: string, track: Track): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.topic === topic && l.track === track)
    ?? ALL_LESSONS.find((l) => l.topic === topic)
}

/** Get all lessons for a track+module */
export function getLessonsForModule(track: Track, module: Module): Lesson[] {
  return ALL_LESSONS.filter((l) => l.track === track && l.module === module)
}
