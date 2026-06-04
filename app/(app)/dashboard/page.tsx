import Link from 'next/link'
import { getServerUser } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { formatDate, scoreColor, percentOf } from '@/lib/utils'
import ProgressBar from '@/components/ProgressBar'
import ScoreBadge from '@/components/ScoreBadge'
import type { Progress, QuizResult } from '@/lib/types'

async function getDashboardData(userId: string) {
  const db = createServiceClient()
  const [progressRes, recentQuizRes] = await Promise.all([
    db.from('progress').select('*').eq('user_id', userId).single(),
    db.from('quiz_history').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(5),
  ])
  return {
    progress: progressRes.data as Progress | null,
    recentQuiz: (recentQuizRes.data ?? []) as QuizResult[],
  }
}

const moduleData = [
  { id: 'grammar', label: 'Grammar', label_hi: 'व्याकरण', color: 'from-blue to-blue-mid', icon: '📝' },
  { id: 'vocabulary', label: 'Vocabulary', label_hi: 'शब्द भंडार', color: 'from-orange to-saffron', icon: '📚' },
  { id: 'comprehension', label: 'Comprehension', label_hi: 'बोध', color: 'from-emerald-700 to-emerald-500', icon: '🔍' },
  { id: 'writing', label: 'Writing', label_hi: 'लेखन', color: 'from-purple-800 to-purple-600', icon: '✍️' },
]

export default async function DashboardPage() {
  const user = getServerUser()
  if (!user) return null

  const { progress, recentQuiz } = await getDashboardData(user.userId)

  const stats = [
    {
      label: 'Questions Done',
      value: progress?.questions_attempted ?? 0,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'text-blue-300',
    },
    {
      label: 'Avg Score',
      value: `${progress?.avg_score ?? 0}%`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      color: 'text-orange',
    },
    {
      label: 'Papers Done',
      value: progress?.papers_completed ?? 0,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'text-emerald-400',
    },
    {
      label: 'Day Streak',
      value: progress?.streak_days ?? 0,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
      color: 'text-red-400',
    },
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome banner */}
      <div className="fade-up rounded-2xl bg-gradient-to-br from-blue via-blue-mid to-navy border border-blue-600/30 p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-orange/5 rounded-full blur-3xl" />
        <div className="absolute left-1/2 bottom-0 w-96 h-32 bg-blue/20 rounded-full blur-3xl" />
        <div className="relative">
          <p className="text-white/50 text-sm mb-1">नमस्ते,</p>
          <h2 className="display text-3xl text-white mb-1">{user.name}</h2>
          <p className="hindi text-orange/80 text-sm mb-4">
            {user.track === 'psle' ? 'PSLE की तैयारी जारी रखें!' : 'O-Level की तैयारी जारी रखें!'}
          </p>
          {progress?.last_active && (
            <p className="text-white/40 text-xs">
              Last active {formatDate(progress.last_active)}
            </p>
          )}
        </div>
      </div>

      {/* Track selector */}
      <div className="fade-up-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/track/psle"
          className={`group glass rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover ${user.track === 'psle' ? 'border-orange/40 bg-orange/5' : 'border-white/10'}`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue to-blue-mid flex items-center justify-center">
              <span className="hindi text-white text-lg">प्राथमिक</span>
            </div>
            <div>
              <p className="font-semibold text-white">PSLE Track</p>
              <p className="text-white/50 text-xs mt-0.5">Primary 3–6 · Hindi B</p>
            </div>
            {user.track === 'psle' && (
              <span className="ml-auto text-xs font-semibold bg-orange/20 text-orange border border-orange/30 px-2.5 py-1 rounded-full">Active</span>
            )}
          </div>
        </Link>

        <Link
          href="/track/olevel"
          className={`group glass rounded-2xl p-5 border transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover ${user.track === 'olevel' ? 'border-orange/40 bg-orange/5' : 'border-white/10'}`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange to-saffron flex items-center justify-center">
              <span className="hindi text-white text-lg">माध्यमिक</span>
            </div>
            <div>
              <p className="font-semibold text-white">O-Level Track</p>
              <p className="text-white/50 text-xs mt-0.5">Secondary 1–4 · Hindi B</p>
            </div>
            {user.track === 'olevel' && (
              <span className="ml-auto text-xs font-semibold bg-orange/20 text-orange border border-orange/30 px-2.5 py-1 rounded-full">Active</span>
            )}
          </div>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="fade-up-2 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="glass rounded-2xl p-4 border border-white/10">
            <div className={`${stat.color} mb-2`}>{stat.icon}</div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Modules overview */}
      <div className="fade-up-3">
        <h3 className="display text-lg text-white mb-4">Study Modules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {moduleData.map((mod) => (
            <Link
              key={mod.id}
              href={`/module/${mod.id}`}
              className="glass rounded-2xl p-5 border border-white/10 hover:border-orange/30 transition-all duration-200 hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center`}>
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-white">{mod.label}</p>
                  <p className="hindi text-white/40 text-sm">{mod.label_hi}</p>
                </div>
                <svg className="w-5 h-5 text-white/30 ml-auto group-hover:text-orange/60 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <ProgressBar value={0} color="orange" height="sm" label="Progress" showPercent />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      {recentQuiz.length > 0 && (
        <div className="fade-up-4">
          <h3 className="display text-lg text-white mb-4">Recent Activity</h3>
          <div className="glass rounded-2xl border border-white/10 overflow-hidden">
            {recentQuiz.map((quiz, i) => {
              const pct = percentOf(quiz.score, quiz.total)
              return (
                <div key={i} className={`flex items-center gap-4 px-5 py-4 ${i < recentQuiz.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/5 transition-colors`}>
                  <div className="w-8 h-8 rounded-lg bg-blue-mid/30 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{quiz.topic}</p>
                    <p className="text-xs text-white/40 mt-0.5">{quiz.module} · {quiz.created_at ? formatDate(quiz.created_at) : ''}</p>
                  </div>
                  <ScoreBadge score={quiz.score} total={quiz.total} size="sm" />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
