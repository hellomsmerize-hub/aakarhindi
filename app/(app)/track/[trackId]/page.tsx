import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServerUser } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { getExamPapersByTrack } from '@/data/index'
import type { Track, Level } from '@/lib/types'
import ProgressBar from '@/components/ProgressBar'
import ScoreBadge from '@/components/ScoreBadge'

interface PageProps {
  params: { trackId: string }
}

const LEVELS: { id: Level; label: string; label_hi: string; desc: string; color: string }[] = [
  { id: 'foundational', label: 'Foundational', label_hi: 'आधारभूत', desc: 'Core concepts and basic skills', color: 'from-emerald-700 to-emerald-500' },
  { id: 'advanced', label: 'Advanced', label_hi: 'उन्नत', desc: 'Complex grammar and comprehension', color: 'from-blue to-blue-mid' },
  { id: 'expert', label: 'Expert', label_hi: 'विशेषज्ञ', desc: 'Exam-level mastery', color: 'from-orange to-saffron' },
]

export default async function TrackPage({ params }: PageProps) {
  if (!['psle', 'olevel'].includes(params.trackId)) notFound()

  const user = getServerUser()
  if (!user) return null

  const track = params.trackId as Track
  const trackLabel = track === 'psle' ? 'PSLE' : 'O-Level'
  const trackHindi = track === 'psle' ? 'प्राथमिक शिक्षा' : 'माध्यमिक शिक्षा'

  const papers = getExamPapersByTrack(track)

  const db = createServiceClient()
  const { data: examResults } = await db
    .from('exam_history')
    .select('paper_id, score, max_score')
    .eq('user_id', user.userId)

  const completedPapers = new Set(Array.from((examResults ?? []).map((r: { paper_id: string }) => r.paper_id)))

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="fade-up glass rounded-2xl p-6 border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-48 h-48 bg-orange/5 rounded-full blur-3xl" />
        <div className="flex items-center gap-4 relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange to-saffron flex items-center justify-center shadow-orange">
            <span className="hindi text-white text-xl font-bold">ह</span>
          </div>
          <div>
            <h2 className="display text-2xl text-white">{trackLabel} Track</h2>
            <p className="hindi text-orange/80 text-sm mt-0.5">{trackHindi}</p>
          </div>
        </div>
      </div>

      {/* Level cards */}
      <div className="fade-up-1">
        <h3 className="display text-lg text-white mb-4">Choose Your Level</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {LEVELS.map((level, i) => {
            const isLocked = i > 0
            return (
              <div
                key={level.id}
                className={`glass rounded-2xl p-5 border transition-all duration-200 ${isLocked ? 'border-white/5 opacity-60' : 'border-white/15 hover:border-orange/30 hover:-translate-y-1'}`}
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center mb-4 ${isLocked ? 'grayscale' : ''}`}>
                  {isLocked ? (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  )}
                </div>
                <p className="font-semibold text-white">{level.label}</p>
                <p className="hindi text-white/40 text-sm">{level.label_hi}</p>
                <p className="text-white/40 text-xs mt-1">{level.desc}</p>
                {isLocked ? (
                  <p className="text-white/30 text-xs mt-3 font-medium">Complete previous level to unlock</p>
                ) : (
                  <Link
                    href={`/quiz/grammar?track=${track}&level=${level.id}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-orange text-sm font-medium hover:text-saffron transition-colors"
                  >
                    Start Practice
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Past papers */}
      <div className="fade-up-2">
        <h3 className="display text-lg text-white mb-4">Past Exam Papers</h3>
        <div className="space-y-3">
          {papers.map((paper) => {
            const done = completedPapers.has(paper.id)
            const result = (examResults ?? []).find((r: { paper_id: string; score: number; max_score: number }) => r.paper_id === paper.id)
            return (
              <div key={paper.id} className="glass rounded-2xl p-5 border border-white/10 hover:border-orange/30 transition-all duration-200">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-mid/30 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">{paper.title}</p>
                    <p className="text-xs text-white/40 mt-0.5">{paper.time_minutes} min · {paper.total_marks} marks · Pass: {paper.pass_mark}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {done && result && (
                      <ScoreBadge score={result.score} total={result.max_score} size="sm" />
                    )}
                    <Link
                      href={`/exam/${paper.id}`}
                      className="bg-gradient-to-r from-orange to-saffron text-white text-sm font-semibold px-4 py-2 rounded-xl hover:shadow-orange transition-all duration-200"
                    >
                      {done ? 'Retake' : 'Start'}
                    </Link>
                  </div>
                </div>
                {done && result && (
                  <div className="mt-3">
                    <ProgressBar
                      value={Math.round((result.score / result.max_score) * 100)}
                      color="auto"
                      height="sm"
                      showPercent
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
