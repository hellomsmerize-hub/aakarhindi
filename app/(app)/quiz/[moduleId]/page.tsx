import { notFound } from 'next/navigation'
import { getServerUser } from '@/lib/auth'
import { getQuestions } from '@/data/index'
import type { Module, Track, Level } from '@/lib/types'
import QuizClient from './QuizClient'

interface PageProps {
  params: { moduleId: string }
  searchParams: { topic?: string; level?: string }
}

const VALID_MODULES = ['grammar', 'vocabulary', 'comprehension', 'writing']

export default async function QuizPage({ params, searchParams }: PageProps) {
  if (!VALID_MODULES.includes(params.moduleId)) notFound()

  const user = getServerUser()
  if (!user) return null

  const moduleId = params.moduleId as Module
  const topic = searchParams.topic ?? 'general'
  const level = (searchParams.level ?? 'foundational') as Level
  const track = user.track as Track

  // Load real questions filtered by track + module + topic
  const questions = getQuestions(track, moduleId, topic === 'general' ? undefined : topic, level, 10)

  // Fallback: if no questions for specific topic, load any for that module
  const finalQuestions = questions.length > 0
    ? questions
    : getQuestions(track, moduleId, undefined, undefined, 10)

  return (
    <QuizClient
      questions={finalQuestions}
      moduleId={moduleId}
      topic={topic}
    />
  )
}
