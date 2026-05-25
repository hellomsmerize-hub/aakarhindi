'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import ScoreBadge from '@/components/ScoreBadge'
import ProgressBar from '@/components/ProgressBar'
import { formatDate, percentOf } from '@/lib/utils'
import type { QuizResult, ExamResult, ModuleProgress } from '@/lib/types'

interface StudentDetail {
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

interface StudentDetailResponse {
  student: StudentDetail
  quizResults: QuizResult[]
  examResults: ExamResult[]
  moduleProgress: ModuleProgress[]
}

const MODULE_LABELS: Record<string, string> = {
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  comprehension: 'Comprehension',
  writing: 'Writing',
}

export default function StudentDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [data, setData] = useState<StudentDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'quizzes' | 'exams'>('overview')
  const [resetPassword, setResetPassword] = useState('')
  const [resetError, setResetError] = useState('')
  const [resetSuccess, setResetSuccess] = useState(false)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    fetch(`/api/students/${id}`)
      .then((r) => r.json() as Promise<StudentDetailResponse>)
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault()
    setResetError('')
    setResetSuccess(false)
    setResetting(true)
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: resetPassword }),
      })
      if (!res.ok) {
        const d = await res.json() as { error?: string }
        setResetError(d.error ?? 'Failed to reset password.')
      } else {
        setResetSuccess(true)
        setResetPassword('')
      }
    } catch {
      setResetError('Network error.')
    } finally {
      setResetting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex gap-1.5">
          {[0, 150, 300].map((delay, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-orange/60 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-24">
        <p className="text-white/40">Student not found.</p>
        <Link href="/teacher" className="text-orange text-sm mt-2 inline-block">← Back to dashboard</Link>
      </div>
    )
  }

  const { student, quizResults, examResults, moduleProgress } = data
  const progress = student.progress

  const moduleStats = Object.keys(MODULE_LABELS).map((mod) => {
    const modP = moduleProgress.filter((p) => p.module === mod)
    const completed = modP.filter((p) => p.completed).length
    const scores = modP.filter((p) => p.score !== null).map((p) => p.score as number)
    const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    return { mod, label: MODULE_LABELS[mod], completed, total: modP.length, avg }
  })

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back + header */}
      <div className="fade-up">
        <Link href="/teacher" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Students
        </Link>

        <div className="glass rounded-2xl p-6 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue to-blue-mid flex items-center justify-center border border-white/20">
              <span className="text-xl font-bold text-white">{student.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="display text-2xl text-white">{student.name}</h2>
              <p className="text-white/40 text-sm">@{student.username} · {student.grade}</p>
            </div>
            <div className="ml-auto">
              <span className={student.track === 'psle' ? 'badge-psle' : 'badge-olevel'}>
                {student.track.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
            {[
              { label: 'Questions', value: progress?.questions_attempted ?? 0 },
              { label: 'Avg Score', value: `${progress?.avg_score ?? 0}%` },
              { label: 'Papers', value: progress?.papers_completed ?? 0 },
              { label: 'Streak', value: `${progress?.streak_days ?? 0}d` },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-3 text-center">
                <p className="text-white font-bold text-lg">{s.value}</p>
                <p className="text-white/40 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {progress?.last_active && (
            <p className="text-white/30 text-xs mt-4">Last active {formatDate(progress.last_active)}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="fade-up-1 flex gap-2">
        {(['overview', 'quizzes', 'exams'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${activeTab === tab ? 'bg-orange/20 text-orange border border-orange/40' : 'glass border border-white/10 text-white/50 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4 fade-up">
          <h3 className="display text-lg text-white">Module Progress</h3>
          <div className="space-y-4">
            {moduleStats.map((m) => (
              <div key={m.mod} className="glass rounded-xl p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">{m.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white/40 text-xs">{m.completed}/{m.total} topics</span>
                    {m.avg > 0 && <ScoreBadge score={m.avg} size="sm" />}
                  </div>
                </div>
                <ProgressBar value={m.total > 0 ? percentOf(m.completed, m.total) : 0} color="auto" height="sm" />
              </div>
            ))}
          </div>

          {/* Password reset */}
          <div className="glass rounded-2xl p-6 border border-red-500/20 mt-2">
            <h3 className="text-white font-semibold mb-1">Reset Password</h3>
            <p className="text-white/40 text-sm mb-4">Set a new password for this student.</p>
            <form onSubmit={handleResetPassword} className="flex flex-col sm:flex-row gap-3">
              <input
                type="password"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                placeholder="New password (min 6 chars)"
                minLength={6}
                required
                className="input-field flex-1"
              />
              <button
                type="submit"
                disabled={resetting || !resetPassword || resetPassword.length < 6}
                className="shrink-0 bg-red-600/80 hover:bg-red-600 text-white font-semibold px-5 py-3 rounded-xl transition-all disabled:opacity-50 text-sm"
              >
                {resetting ? 'Saving…' : 'Reset'}
              </button>
            </form>
            {resetError && <p className="text-red-400 text-sm mt-2">{resetError}</p>}
            {resetSuccess && <p className="text-green-400 text-sm mt-2">Password reset successfully.</p>}
          </div>
        </div>
      )}

      {/* Quizzes tab */}
      {activeTab === 'quizzes' && (
        <div className="fade-up space-y-3">
          {quizResults.length === 0 ? (
            <div className="glass rounded-2xl p-12 border border-white/10 text-center">
              <p className="text-white/40">No quizzes completed yet.</p>
            </div>
          ) : (
            <div className="glass rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full data-table">
                <thead>
                  <tr>
                    <th>Module</th>
                    <th>Topic</th>
                    <th className="hidden sm:table-cell">Date</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {quizResults.map((q, i) => (
                    <tr key={i}>
                      <td className="capitalize">{q.module}</td>
                      <td>{q.topic.replace(/-/g, ' ')}</td>
                      <td className="hidden sm:table-cell text-white/40">{q.created_at ? formatDate(q.created_at) : '—'}</td>
                      <td><ScoreBadge score={q.score} total={q.total} size="sm" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Exams tab */}
      {activeTab === 'exams' && (
        <div className="fade-up space-y-3">
          {examResults.length === 0 ? (
            <div className="glass rounded-2xl p-12 border border-white/10 text-center">
              <p className="text-white/40">No exams completed yet.</p>
            </div>
          ) : (
            examResults.map((e, i) => {
              const pct = percentOf(e.score, e.max_score)
              return (
                <div key={i} className="glass rounded-xl p-4 border border-white/10">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex-1">
                      <p className="font-medium text-white text-sm">{e.paper_id}</p>
                      <p className="text-white/40 text-xs mt-0.5">{e.created_at ? formatDate(e.created_at) : ''}</p>
                    </div>
                    <ScoreBadge score={e.score} total={e.max_score} size="sm" />
                    {e.oe_flagged && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full">OE Review</span>
                    )}
                  </div>
                  <ProgressBar value={pct} color="auto" height="sm" />
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
