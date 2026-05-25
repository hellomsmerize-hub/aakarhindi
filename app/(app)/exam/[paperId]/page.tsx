'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ExamTimer from '@/components/ExamTimer'
import ScoreBadge from '@/components/ScoreBadge'
import ProgressBar from '@/components/ProgressBar'
import type { ExamPaper, Question } from '@/lib/types'
import { percentOf, formatSeconds } from '@/lib/utils'
import { examPapers } from '@/data/index'

// Sample exam paper – in production, fetched from the DB
const SAMPLE_PAPER: ExamPaper = {
  id: 'p2023',
  title: '2023 PSLE Hindi B',
  title_hindi: '२०२३ पी.एस.एल.ई. हिंदी बी',
  track: 'psle',
  level: 'foundational',
  year: 2023,
  time_minutes: 5, // shortened for demo
  total_marks: 20,
  pass_mark: 12,
  sections: [
    {
      id: 's1',
      name: 'Section A: Grammar',
      name_hindi: 'खंड अ: व्याकरण',
      instructions: 'Choose the correct answer for each question.',
      marks: 10,
      questions: [
        {
          id: 'e1', type: 'mcq', module: 'grammar', topic: 'nouns', track: 'psle', level: 'foundational', difficulty: 'easy',
          question: 'Which word is feminine (स्त्रीलिंग)?',
          options: ['लड़का', 'घोड़ा', 'लड़की', 'राजा'],
          correct: 2,
          explanation: '"लड़की" स्त्रीलिंग है।',
          explanation_en: '"Ladki" (girl) is feminine.',
        },
        {
          id: 'e2', type: 'mcq', module: 'grammar', topic: 'verbs', track: 'psle', level: 'foundational', difficulty: 'medium',
          question: 'Complete the sentence: वह पुस्तक ___ है। (She is reading a book)',
          options: ['पढ़ रही', 'पढ़ रहा', 'पढ़ रहे', 'पढ़ता'],
          correct: 0,
          explanation: 'स्त्रीलिंग के साथ "पढ़ रही" का प्रयोग होता है।',
          explanation_en: 'With feminine subject, we use "padh rahee".',
        },
        {
          id: 'e3', type: 'mcq', module: 'grammar', topic: 'postpositions', track: 'psle', level: 'foundational', difficulty: 'easy',
          question: 'Choose the correct postposition: वह स्कूल ___ जाता है। (He goes to school)',
          options: ['में', 'पर', 'को', 'से'],
          correct: 2,
          explanation: '"को" का प्रयोग लक्ष्य या गंतव्य के लिए होता है।',
          explanation_en: '"Ko" is used to indicate direction or destination.',
        },
      ],
    },
    {
      id: 's2',
      name: 'Section B: Vocabulary',
      name_hindi: 'खंड ब: शब्द भंडार',
      instructions: 'Fill in the blanks with the appropriate words.',
      marks: 10,
      questions: [
        {
          id: 'e4', type: 'mcq', module: 'vocabulary', topic: 'synonyms', track: 'psle', level: 'foundational', difficulty: 'medium',
          question: 'Which word means the opposite of "दिन" (day)?',
          options: ['सुबह', 'रात', 'शाम', 'दोपहर'],
          correct: 1,
          explanation: '"रात" का अर्थ night है, जो "दिन" (day) का विलोम है।',
          explanation_en: '"Raat" (night) is the antonym of "din" (day).',
        },
        {
          id: 'e5', type: 'mcq', module: 'vocabulary', topic: 'daily-life', track: 'psle', level: 'foundational', difficulty: 'easy',
          question: 'What does "पानी" mean?',
          options: ['Fire', 'Water', 'Air', 'Earth'],
          correct: 1,
          explanation: '"पानी" का अर्थ water (जल) है।',
          explanation_en: '"Paanee" means water.',
        },
      ],
    },
  ],
}

interface PageProps {
  params: { paperId: string }
}

type AnswerMap = Record<string, number | string>

export default function ExamPage({ params }: PageProps) {
  const router = useRouter()
  const paper = examPapers.find((p) => p.id === params.paperId) ?? examPapers[0]
  const allQuestions: { q: Question; sectionName: string }[] = paper.sections.flatMap((s) =>
    s.questions.map((q) => ({ q, sectionName: s.name }))
  )

  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState<AnswerMap>({})
  const [submitted, setSubmitted] = useState(false)
  const [timedOut, setTimedOut] = useState(false)
  const [startTime] = useState(() => Date.now())
  const [saving, setSaving] = useState(false)

  const section = paper.sections[currentSection]
  const totalAnswered = Object.keys(answers).length
  const totalQuestions = allQuestions.length

  const handleAnswer = useCallback((questionId: string, answer: number | string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
  }, [])

  const handleSubmit = useCallback(async () => {
    const timeTaken = Math.round((Date.now() - startTime) / 1000)

    let score = 0
    allQuestions.forEach(({ q }) => {
      const answer = answers[q.id]
      if (answer !== undefined && answer === q.correct) score++
    })

    const hasOE = allQuestions.some(({ q }) => q.type === 'oe')

    setSaving(true)
    try {
      await fetch('/api/progress/exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paper_id: paper.id,
          score,
          max_score: totalQuestions,
          time_taken_seconds: timeTaken,
          answers_json: answers,
          oe_flagged: hasOE,
        }),
      })
    } catch {
      // Non-fatal
    } finally {
      setSaving(false)
    }

    setSubmitted(true)
  }, [startTime, allQuestions, answers, paper.id, totalQuestions])

  const handleExpire = useCallback(() => {
    setTimedOut(true)
    handleSubmit()
  }, [handleSubmit])

  // Results screen
  if (submitted) {
    let score = 0
    allQuestions.forEach(({ q }) => {
      if (answers[q.id] === q.correct) score++
    })
    const pct = percentOf(score, totalQuestions)
    const passed = score >= Math.round(paper.pass_mark / (paper.total_marks / totalQuestions))

    return (
      <div className="max-w-2xl mx-auto space-y-6 fade-up">
        {timedOut && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Time&apos;s up! Exam auto-submitted.
          </div>
        )}

        <div className="glass rounded-2xl p-8 border border-white/10 text-center">
          <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${passed ? 'bg-green-500/20 border-2 border-green-500/40' : 'bg-red-500/20 border-2 border-red-500/40'}`}>
            {passed ? (
              <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
          <h2 className="display text-2xl text-white mb-1">{passed ? 'Well Done!' : 'Keep Practising'}</h2>
          <p className="hindi text-white/50 mb-4">{paper.title_hindi}</p>
          <ScoreBadge score={score} total={totalQuestions} size="lg" showLabel />
          <div className="mt-6">
            <ProgressBar value={pct} color="auto" height="lg" showPercent />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 text-sm">
            <div className="glass rounded-xl p-3">
              <p className="text-white/40 text-xs">Correct</p>
              <p className="text-green-400 font-bold text-xl">{score}</p>
            </div>
            <div className="glass rounded-xl p-3">
              <p className="text-white/40 text-xs">Wrong</p>
              <p className="text-red-400 font-bold text-xl">{totalQuestions - score}</p>
            </div>
            <div className="glass rounded-xl p-3">
              <p className="text-white/40 text-xs">Time</p>
              <p className="text-white font-bold text-base">{formatSeconds(Math.round((Date.now() - startTime) / 1000))}</p>
            </div>
          </div>
        </div>

        {/* Answer review */}
        <div>
          <h3 className="display text-lg text-white mb-4">Answer Review</h3>
          <div className="space-y-3">
            {allQuestions.map(({ q, sectionName }, i) => {
              const given = answers[q.id]
              const correct = given === q.correct
              return (
                <div key={q.id} className="glass rounded-xl p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${correct ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {correct ? (
                        <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/40 mb-1">{sectionName} · Q{i + 1}</p>
                      <p className="text-white text-sm mb-2">{q.question}</p>
                      {q.options && (
                        <p className="text-xs">
                          <span className="text-white/40">Your answer: </span>
                          <span className={correct ? 'text-green-400' : 'text-red-400'}>
                            {given !== undefined ? q.options[given as number] ?? String(given) : 'Not answered'}
                          </span>
                          {!correct && typeof q.correct === 'number' && (
                            <>
                              <span className="text-white/40"> · Correct: </span>
                              <span className="text-green-400">{q.options[q.correct]}</span>
                            </>
                          )}
                        </p>
                      )}
                      <p className="hindi text-blue-200/70 text-xs mt-2">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <Link href={`/track/${paper.track}`} className="flex-1 glass border border-white/20 text-white/70 font-medium py-3 rounded-xl hover:border-white/40 hover:text-white transition-all text-center text-sm">
            Back to Track
          </Link>
          <Link href="/dashboard" className="flex-1 bg-gradient-to-r from-orange to-saffron text-white font-semibold py-3 rounded-xl hover:shadow-orange transition-all text-center text-sm">
            Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Exam header */}
      <div className="fade-up flex flex-col sm:flex-row sm:items-center gap-4 glass rounded-2xl p-4 border border-white/10">
        <div className="flex-1 min-w-0">
          <h2 className="display text-lg text-white">{paper.title}</h2>
          <p className="hindi text-white/40 text-sm">{paper.title_hindi}</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <ExamTimer totalSeconds={paper.time_minutes * 60} onExpire={handleExpire} />
          <span className="text-xs text-white/40">{totalAnswered}/{totalQuestions} answered</span>
        </div>
      </div>

      {/* Progress bar */}
      <ProgressBar value={percentOf(totalAnswered, totalQuestions)} color="orange" height="sm" />

      {/* Section tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {paper.sections.map((s, i) => {
          const sectionAnswered = s.questions.filter((q) => answers[q.id] !== undefined).length
          return (
            <button
              key={s.id}
              onClick={() => setCurrentSection(i)}
              className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${currentSection === i ? 'bg-orange/20 text-orange border border-orange/40' : 'glass border border-white/10 text-white/50 hover:text-white'}`}
            >
              {s.name.split(':')[0]}
              <span className="ml-2 text-xs opacity-60">{sectionAnswered}/{s.questions.length}</span>
            </button>
          )
        })}
      </div>

      {/* Section instructions */}
      {section.instructions && (
        <div className="bg-blue-mid/15 border border-blue/30 rounded-xl px-4 py-3">
          <p className="hindi text-blue-100 text-sm">{section.instructions}</p>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {section.questions.map((q, qi) => {
          const given = answers[q.id]
          return (
            <div key={q.id} className="glass rounded-2xl p-5 border border-white/10">
              <p className="text-xs text-white/40 mb-2">Question {qi + 1} · {q.difficulty}</p>
              <p className="text-white font-medium mb-4">{q.question}</p>
              {(q.type === 'mcq' || q.type === 'obj') && q.options && (
                <div className="space-y-2.5">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      onClick={() => handleAnswer(q.id, oi)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-all ${given === oi ? 'border-orange/60 bg-orange/15 text-orange' : 'border-white/15 bg-white/5 text-white/70 hover:border-orange/40 hover:bg-orange/5'}`}
                    >
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${given === oi ? 'border-orange bg-orange/30 text-orange' : 'border-white/30 text-white/40'}`}>
                        {String.fromCharCode(65 + oi)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              {q.type === 'fib' && (
                <input
                  type="text"
                  value={(given as string) ?? ''}
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  placeholder="Type your answer…"
                  className="input-field hindi text-lg"
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        {currentSection > 0 ? (
          <button onClick={() => setCurrentSection((i) => i - 1)} className="glass border border-white/20 text-white/60 px-5 py-3 rounded-xl hover:border-white/40 hover:text-white transition-all text-sm">
            ← Previous Section
          </button>
        ) : <div />}

        {currentSection < paper.sections.length - 1 ? (
          <button onClick={() => setCurrentSection((i) => i + 1)} className="bg-gradient-to-r from-orange to-saffron text-white font-semibold px-5 py-3 rounded-xl hover:shadow-orange transition-all text-sm">
            Next Section →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-gradient-to-r from-orange to-saffron text-white font-semibold px-6 py-3 rounded-xl hover:shadow-orange transition-all text-sm disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting…
              </>
            ) : 'Submit Exam'}
          </button>
        )}
      </div>
    </div>
  )
}
