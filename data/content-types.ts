export * from '@/lib/types'
import type { Question, Module } from '@/lib/types'

export function getQuestionsForTopic(questions: Question[], topic: string, count = 10): Question[] {
  const filtered = questions.filter(q => q.topic === topic)
  // Shuffle deterministically based on topic
  return filtered.sort(() => 0.5 - Math.sin(topic.charCodeAt(0))).slice(0, count)
}

export function getQuestionsForModule(questions: Question[], module: Module, count = 20): Question[] {
  return questions.filter(q => q.module === module).slice(0, count)
}
