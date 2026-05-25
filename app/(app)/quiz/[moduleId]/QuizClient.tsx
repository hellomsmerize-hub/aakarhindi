'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import QuizEngine from '@/components/QuizEngine'
import type { Question, Module } from '@/lib/types'

interface QuizClientProps {
  questions: Question[]
  moduleId: Module
  topic: string
}

export default function QuizClient({ questions, moduleId, topic }: QuizClientProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleComplete = useCallback(async (score: number, total: number, timeTaken: number) => {
    setSaving(true)
    try {
      await fetch('/api/progress/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ module: moduleId, topic, score, total, time_taken_seconds: timeTaken }),
      })
      setSaved(true)
    } catch {
      // Non-fatal
    } finally {
      setSaving(false)
    }
  }, [moduleId, topic])

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="fade-up flex items-center justify-between">
        <div>
          <Link href={`/module/${moduleId}`} className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>
          <h2 className="display text-xl text-white mt-2">
            {moduleId.charAt(0).toUpperCase() + moduleId.slice(1)} Quiz
          </h2>
          <p className="text-white/40 text-sm capitalize">{topic.replace(/-/g, ' ')} · {questions.length} questions</p>
        </div>
        {saving && (
          <div className="flex items-center gap-1.5 text-orange/70 text-xs">
            <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Saving…
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-1.5 text-green-400 text-xs">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Saved
          </div>
        )}
      </div>

      <QuizEngine
        questions={questions}
        module={moduleId}
        topic={topic}
        onComplete={handleComplete}
      />

      {saved && (
        <div className="fade-up flex flex-col sm:flex-row gap-3">
          <Link
            href={`/module/${moduleId}`}
            className="flex-1 glass border border-white/20 text-white/70 font-medium py-3 rounded-xl hover:border-white/40 hover:text-white transition-all text-center text-sm"
          >
            Back to Module
          </Link>
          <button
            onClick={() => { setSaved(false); setSaving(false); router.refresh() }}
            className="flex-1 bg-gradient-to-r from-orange to-saffron text-white font-semibold py-3 rounded-xl hover:shadow-orange transition-all text-sm"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  )
}
