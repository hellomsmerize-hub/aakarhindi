import { getServerUser } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import type { Progress, QuizResult, ExamResult, ModuleProgress } from '@/lib/types'
import ProgressBar from '@/components/ProgressBar'
import ScoreBadge from '@/components/ScoreBadge'
import { formatDate, percentOf } from '@/lib/utils'

async function getProgressData(userId: string) {
  const db = createServiceClient()
  const [progressRes, quizRes, examRes, moduleRes] = await Promise.all([
    db.from('progress').select('*').eq('user_id', userId).single(),
    db.from('quiz_history').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(30),
    db.from('exam_history').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(10),
    db.from('module_progress').select('*').eq('user_id', userId),
  ])
  return {
    progress: progressRes.data as Progress | null,
    quizResults: (quizRes.data ?? []) as QuizResult[],
    examResults: (examRes.data ?? []) as ExamResult[],
    moduleProgress: (moduleRes.data ?? []) as ModuleProgress[],
  }
}

const MODULE_LABELS: Record<string, string> = {
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  comprehension: 'Comprehension',
  writing: 'Writing',
}

const ACHIEVEMENTS = [
  { id: 'first-quiz', label: 'First Quiz', label_hi: 'पहली प्रश्नोत्तरी', desc: 'Complete your first quiz', icon: '🎯', threshold: 1, field: 'questions_attempted' },
  { id: '10-questions', label: '10 Questions', label_hi: 'दस प्रश्न', desc: 'Answer 10 questions', icon: '📝', threshold: 10, field: 'questions_attempted' },
  { id: '50-questions', label: '50 Questions', label_hi: 'पचास प्रश्न', desc: 'Answer 50 questions', icon: '🌟', threshold: 50, field: 'questions_attempted' },
  { id: 'first-exam', label: 'First Exam', label_hi: 'पहली परीक्षा', desc: 'Complete your first exam paper', icon: '📄', threshold: 1, field: 'papers_completed' },
  { id: 'streak-3', label: '3-Day Streak', label_hi: 'तीन दिन', desc: 'Study for 3 days in a row', icon: '🔥', threshold: 3, field: 'streak_days' },
  { id: 'streak-7', label: 'Week Warrior', label_hi: 'सात दिन', desc: 'Study for 7 days in a row', icon: '💪', threshold: 7, field: 'streak_days' },
  { id: 'high-score', label: 'High Scorer', label_hi: 'उच्च अंक', desc: 'Get 80%+ average score', icon: '🏆', threshold: 80, field: 'avg_score' },
]

export default async function ProgressPage() {
  const user = getServerUser()
  if (!user) return null

  const { progress, quizResults, examResults, moduleProgress } = await getProgressData(user.userId)

  // Module stats
  const moduleStats = Object.keys(MODULE_LABELS).map((mod) => {
    const modProgress = moduleProgress.filter((p) => p.module === mod)
    const completed = modProgress.filter((p) => p.completed).length
    const scores = modProgress.filter((p) => p.score !== null).map((p) => p.score as number)
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    return { mod, label: MODULE_LABELS[mod], completed, total: modProgress.length, avgScore }
  })

  // Weekly quiz data (last 7 days)
  const now = new Date()
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now)
    d.setDate(d.getDate() - (6 - i))
    return d
  })
  const weeklyData = weekDays.map((day) => {
    const dayStr = day.toDateString()
    const dayQuizzes = quizResults.filter((q) => {
      if (!q.created_at) return false
      return new Date(q.created_at).toDateString() === dayStr
    })
    const avg = dayQuizzes.length > 0 ? Math.round(dayQuizzes.reduce((a, q) => a + percentOf(q.score, q.total), 0) / dayQuizzes.length) : 0
    return { day: day.toLocaleDateString('en', { weekday: 'short' }), avg, count: dayQuizzes.length }
  })

  const maxBarCount = Math.max(...weeklyData.map((d) => d.count), 1)

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header stats */}
      <div className="fade-up grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Questions', value: progress?.questions_attempted ?? 0, color: 'text-blue-300' },
          { label: 'Avg Score', value: `${progress?.avg_score ?? 0}%`, color: 'text-orange' },
          { label: 'Papers Done', value: progress?.papers_completed ?? 0, color: 'text-emerald-400' },
          { label: 'Day Streak', value: progress?.streak_days ?? 0, color: 'text-red-400' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-2xl p-4 border border-white/10">
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-white/40 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Weekly activity chart */}
      <div className="fade-up-1 glass rounded-2xl p-6 border border-white/10">
        <h3 className="display text-lg text-white mb-5">Weekly Activity</h3>
        <div className="flex items-end gap-3 h-32" aria-label="Weekly quiz activity bar chart">
          {weeklyData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col justify-end" style={{ height: 96 }}>
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-orange to-saffron transition-all duration-700 min-h-[4px]"
                  style={{ height: `${Math.max(4, (d.count / maxBarCount) * 96)}px` }}
                  title={`${d.count} quizzes, avg ${d.avg}%`}
                  aria-label={`${d.day}: ${d.count} quizzes`}
                />
              </div>
              <span className="text-white/40 text-xs">{d.day}</span>
              {d.count > 0 && <span className="text-orange/70 text-xs font-semibold">{d.avg}%</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Module scores */}
      <div className="fade-up-2 glass rounded-2xl p-6 border border-white/10">
        <h3 className="display text-lg text-white mb-5">Module Progress</h3>
        <div className="space-y-5">
          {moduleStats.map((m) => (
            <div key={m.mod}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-white font-medium text-sm">{m.label}</span>
                  <span className="text-white/30 text-xs ml-2">{m.completed}/{m.total} topics</span>
                </div>
                {m.avgScore > 0 && <ScoreBadge score={m.avgScore} size="sm" />}
              </div>
              <ProgressBar
                value={m.total > 0 ? percentOf(m.completed, m.total) : 0}
                color="auto"
                height="md"
                showPercent
              />
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="fade-up-3">
        <h3 className="display text-lg text-white mb-4">Achievements</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {ACHIEVEMENTS.map((ach) => {
            let current = 0
            if (progress) {
              if (ach.field === 'questions_attempted') current = progress.questions_attempted
              else if (ach.field === 'papers_completed') current = progress.papers_completed
              else if (ach.field === 'streak_days') current = progress.streak_days
              else if (ach.field === 'avg_score') current = progress.avg_score
            }
            const unlocked = current >= ach.threshold
            return (
              <div
                key={ach.id}
                className={`glass rounded-2xl p-4 border text-center transition-all ${unlocked ? 'border-orange/30 bg-orange/5' : 'border-white/5 opacity-50 grayscale'}`}
                title={ach.desc}
              >
                <div className="text-3xl mb-2">{ach.icon}</div>
                <p className="text-white text-xs font-semibold">{ach.label}</p>
                <p className="hindi text-white/40 text-xs mt-0.5">{ach.label_hi}</p>
                {!unlocked && (
                  <p className="text-white/30 text-xs mt-1">{current}/{ach.threshold}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent quiz history */}
      {quizResults.length > 0 && (
        <div className="fade-up-4">
          <h3 className="display text-lg text-white mb-4">Quiz History</h3>
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
                {quizResults.slice(0, 15).map((q, i) => (
                  <tr key={i}>
                    <td className="capitalize">{q.module}</td>
                    <td className="truncate max-w-xs">{q.topic.replace(/-/g, ' ')}</td>
                    <td className="hidden sm:table-cell text-white/40">{q.created_at ? formatDate(q.created_at) : '—'}</td>
                    <td><ScoreBadge score={q.score} total={q.total} size="sm" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Exam history */}
      {examResults.length > 0 && (
        <div>
          <h3 className="display text-lg text-white mb-4">Exam History</h3>
          <div className="space-y-3">
            {examResults.map((e, i) => {
              const pct = percentOf(e.score, e.max_score)
              return (
                <div key={i} className="glass rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm">{e.paper_id}</p>
                      <p className="text-white/40 text-xs mt-0.5">{e.created_at ? formatDate(e.created_at) : ''}</p>
                    </div>
                    <ScoreBadge score={e.score} total={e.max_score} size="sm" />
                  </div>
                  <div className="mt-3">
                    <ProgressBar value={pct} color="auto" height="sm" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
