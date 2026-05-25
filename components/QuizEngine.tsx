'use client'

import { useState, useCallback } from 'react'
import type { Question, Module } from '@/lib/types'
import { cn, percentOf } from '@/lib/utils'
import ProgressBar from './ProgressBar'
import ScoreBadge from './ScoreBadge'

interface QuizEngineProps {
  questions: Question[]
  module: Module
  topic: string
  onComplete: (score: number, total: number, timeTaken: number) => void
}

interface AnswerState {
  selected: number | string | null
  submitted: boolean
  correct: boolean
}

export default function QuizEngine({ questions, module: mod, topic, onComplete }: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerState[]>(
    questions.map(() => ({ selected: null, submitted: false, correct: false }))
  )
  const [startTime] = useState(() => Date.now())
  const [finished, setFinished] = useState(false)
  const [fibInput, setFibInput] = useState('')

  const current = questions[currentIndex]
  const currentAnswer = answers[currentIndex]
  const totalCorrect = answers.filter((a) => a.correct).length

  const handleMcqSelect = useCallback((optionIndex: number) => {
    if (currentAnswer.submitted) return
    setAnswers((prev) =>
      prev.map((a, i) => (i === currentIndex ? { ...a, selected: optionIndex } : a))
    )
  }, [currentAnswer.submitted, currentIndex])

  const handleSubmitAnswer = useCallback(() => {
    if (currentAnswer.submitted) return
    const selected = current.type === 'fib' ? fibInput.trim().toLowerCase() : currentAnswer.selected
    if (selected === null || selected === '') return

    let correct = false
    if (current.type === 'mcq' || current.type === 'obj') {
      correct = selected === current.correct
    } else if (current.type === 'fib') {
      const correctStr = String(current.correct).toLowerCase().trim()
      correct = selected === correctStr
    }

    setAnswers((prev) =>
      prev.map((a, i) =>
        i === currentIndex ? { ...a, selected, submitted: true, correct } : a
      )
    )
  }, [currentAnswer.submitted, current, currentIndex, fibInput])

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      setFibInput('')
    } else {
      const timeTaken = Math.round((Date.now() - startTime) / 1000)
      setFinished(true)
      onComplete(totalCorrect + (answers[currentIndex].correct ? 0 : 0), questions.length, timeTaken)
    }
  }, [currentIndex, questions.length, startTime, onComplete, totalCorrect, answers])

  const handleFinish = useCallback(() => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000)
    const finalCorrect = answers.filter((a) => a.correct).length
    setFinished(true)
    onComplete(finalCorrect, questions.length, timeTaken)
  }, [startTime, answers, onComplete, questions.length])

  if (finished) {
    const score = answers.filter((a) => a.correct).length
    const pct = percentOf(score, questions.length)
    return (
      <div className="flex flex-col items-center text-center py-12 px-6 fade-up">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange to-saffron flex items-center justify-center shadow-orange-lg mb-6 float">
          <span className="text-4xl font-bold text-white">{pct}%</span>
        </div>
        <h2 className="display text-2xl text-white mb-2">Quiz Complete!</h2>
        <p className="text-white/60 mb-6">
          You answered <span className="text-white font-semibold">{score}</span> out of{' '}
          <span className="text-white font-semibold">{questions.length}</span> correctly
        </p>
        <ScoreBadge score={score} total={questions.length} size="lg" showLabel />
        <div className="mt-8 w-full max-w-xs">
          <ProgressBar value={pct} color="auto" height="lg" showPercent label="Score" />
        </div>
        <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-sm text-sm">
          <div className="glass rounded-xl p-3">
            <p className="text-white/40 text-xs">Correct</p>
            <p className="text-green-400 font-bold text-xl">{score}</p>
          </div>
          <div className="glass rounded-xl p-3">
            <p className="text-white/40 text-xs">Wrong</p>
            <p className="text-red-400 font-bold text-xl">{questions.length - score}</p>
          </div>
          <div className="glass rounded-xl p-3">
            <p className="text-white/40 text-xs">Questions</p>
            <p className="text-white font-bold text-xl">{questions.length}</p>
          </div>
        </div>
      </div>
    )
  }

  const progress = percentOf(currentIndex, questions.length)

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/40 text-xs uppercase tracking-wider">{mod} · {topic}</p>
          <p className="text-white/70 text-sm mt-0.5">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <ScoreBadge score={totalCorrect} total={currentIndex} size="sm" />
      </div>

      <ProgressBar value={progress} color="orange" height="sm" />

      {/* Question card */}
      <div className="glass rounded-2xl p-6 fade-up">
        {/* Difficulty */}
        <span className={cn(
          'inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-4',
          current.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
          current.difficulty === 'medium' ? 'bg-orange/20 text-orange' :
          'bg-red-500/20 text-red-400'
        )}>
          {current.difficulty}
        </span>

        {/* Context (if any) */}
        {current.context && (
          <div className="bg-blue-mid/20 border border-blue/30 rounded-xl px-4 py-3 mb-4">
            <p className="hindi text-blue-100 text-sm leading-relaxed">{current.context}</p>
          </div>
        )}

        {/* Question */}
        <p className="text-white text-lg font-medium mb-6 leading-relaxed">
          {current.type === 'fib' ? (
            <span dangerouslySetInnerHTML={{ __html: current.question.replace('___', '<span class="inline-block border-b-2 border-orange/60 px-4">___</span>') }} />
          ) : current.question}
        </p>

        {/* MCQ options */}
        {(current.type === 'mcq' || current.type === 'obj') && current.options && (
          <div className="space-y-3">
            {current.options.map((option, idx) => {
              const isSelected = currentAnswer.selected === idx
              const isCorrectOption = current.correct === idx
              let optionClass = 'border-white/15 bg-white/5 text-white/80 hover:border-orange/50 hover:bg-orange/10'

              if (currentAnswer.submitted) {
                if (isCorrectOption) {
                  optionClass = 'border-green-500/60 bg-green-500/15 text-green-300'
                } else if (isSelected && !isCorrectOption) {
                  optionClass = 'border-red-500/60 bg-red-500/15 text-red-300'
                } else {
                  optionClass = 'border-white/10 bg-white/3 text-white/40'
                }
              } else if (isSelected) {
                optionClass = 'border-orange/60 bg-orange/15 text-orange'
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleMcqSelect(idx)}
                  disabled={currentAnswer.submitted}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-all duration-150 disabled:cursor-default',
                    optionClass
                  )}
                  aria-pressed={isSelected}
                >
                  <span className={cn(
                    'w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0',
                    isSelected && !currentAnswer.submitted ? 'border-orange bg-orange/20 text-orange' : 'border-white/30 text-white/50'
                  )}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm leading-relaxed">{option}</span>
                  {currentAnswer.submitted && isCorrectOption && (
                    <svg className="w-5 h-5 text-green-400 ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {currentAnswer.submitted && isSelected && !isCorrectOption && (
                    <svg className="w-5 h-5 text-red-400 ml-auto shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Fill in the blank */}
        {current.type === 'fib' && (
          <div>
            <input
              type="text"
              value={fibInput}
              onChange={(e) => setFibInput(e.target.value)}
              disabled={currentAnswer.submitted}
              placeholder="Type your answer in Hindi…"
              className={cn(
                'input-field hindi text-lg',
                currentAnswer.submitted
                  ? currentAnswer.correct
                    ? 'border-green-500/60 bg-green-500/10 text-green-300'
                    : 'border-red-500/60 bg-red-500/10 text-red-300'
                  : ''
              )}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitAnswer()}
              aria-label="Fill in the blank answer"
            />
            {currentAnswer.submitted && (
              <p className="mt-2 text-sm">
                {currentAnswer.correct ? (
                  <span className="text-green-400">Correct!</span>
                ) : (
                  <span className="text-red-400">
                    Correct answer:{' '}
                    <span className="hindi font-semibold">{String(current.correct)}</span>
                  </span>
                )}
              </p>
            )}
          </div>
        )}

        {/* Explanation (after submit) */}
        {currentAnswer.submitted && (
          <div className="mt-5 bg-blue-mid/20 border border-blue/30 rounded-xl px-4 py-4 fade-up">
            <p className="text-xs font-semibold text-blue-200 mb-2 uppercase tracking-wider">Explanation</p>
            <p className="hindi text-blue-100 text-sm mb-2 leading-relaxed">{current.explanation}</p>
            <p className="text-white/50 text-xs">{current.explanation_en}</p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-between gap-4">
        {!currentAnswer.submitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={current.type === 'fib' ? !fibInput.trim() : currentAnswer.selected === null}
            className="flex-1 bg-gradient-to-r from-orange to-saffron text-white font-semibold py-3 rounded-xl hover:shadow-orange transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        ) : (
          <>
            <button
              onClick={currentIndex === questions.length - 1 ? handleFinish : handleNext}
              className="flex-1 bg-gradient-to-r from-orange to-saffron text-white font-semibold py-3 rounded-xl hover:shadow-orange transition-all duration-200"
            >
              {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question →'}
            </button>
          </>
        )}
        {!currentAnswer.submitted && currentIndex < questions.length - 1 && (
          <button
            onClick={() => {
              setCurrentIndex((i) => i + 1)
              setFibInput('')
            }}
            className="px-4 py-3 rounded-xl border border-white/20 text-white/50 hover:text-white hover:border-white/40 text-sm transition-all"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  )
}
