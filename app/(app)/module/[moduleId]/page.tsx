import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServerUser } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import type { Module, ModuleProgress } from '@/lib/types'
import ProgressBar from '@/components/ProgressBar'
import { percentOf } from '@/lib/utils'

interface PageProps {
  params: { moduleId: string }
}

const MODULE_DATA: Record<string, { label: string; label_hi: string; desc: string; color: string; topics: { id: string; label: string; label_hi: string }[] }> = {
  grammar: {
    label: 'Grammar', label_hi: 'व्याकरण', desc: 'Master Hindi grammatical structures', color: 'from-blue to-blue-mid',
    topics: [
      { id: 'nouns', label: 'Nouns & Gender', label_hi: 'संज्ञा और लिंग' },
      { id: 'verbs', label: 'Verbs & Tense', label_hi: 'क्रिया और काल' },
      { id: 'pronouns', label: 'Pronouns', label_hi: 'सर्वनाम' },
      { id: 'adjectives', label: 'Adjectives', label_hi: 'विशेषण' },
      { id: 'postpositions', label: 'Postpositions', label_hi: 'परसर्ग' },
      { id: 'sentence-structure', label: 'Sentence Structure', label_hi: 'वाक्य संरचना' },
    ],
  },
  vocabulary: {
    label: 'Vocabulary', label_hi: 'शब्द भंडार', desc: 'Expand your Hindi word bank', color: 'from-orange to-saffron',
    topics: [
      { id: 'daily-life', label: 'Daily Life', label_hi: 'दैनिक जीवन' },
      { id: 'family', label: 'Family & Relations', label_hi: 'परिवार और रिश्ते' },
      { id: 'nature', label: 'Nature & Environment', label_hi: 'प्रकृति और पर्यावरण' },
      { id: 'emotions', label: 'Emotions & Feelings', label_hi: 'भावनाएं' },
      { id: 'synonyms', label: 'Synonyms & Antonyms', label_hi: 'पर्यायवाची और विलोम' },
      { id: 'idioms', label: 'Idioms & Phrases', label_hi: 'मुहावरे' },
    ],
  },
  comprehension: {
    label: 'Comprehension', label_hi: 'बोध', desc: 'Understand and analyse Hindi passages', color: 'from-emerald-700 to-emerald-500',
    topics: [
      { id: 'factual', label: 'Factual Passages', label_hi: 'तथ्यात्मक गद्यांश' },
      { id: 'narrative', label: 'Narrative Texts', label_hi: 'वर्णनात्मक पाठ' },
      { id: 'poetry', label: 'Poetry Analysis', label_hi: 'काव्य विश्लेषण' },
      { id: 'inference', label: 'Inference Questions', label_hi: 'अनुमान प्रश्न' },
      { id: 'summary', label: 'Summary Writing', label_hi: 'सारांश लेखन' },
    ],
  },
  writing: {
    label: 'Writing', label_hi: 'लेखन', desc: 'Develop your Hindi writing skills', color: 'from-purple-800 to-purple-600',
    topics: [
      { id: 'informal-letter', label: 'Informal Letter', label_hi: 'अनौपचारिक पत्र' },
      { id: 'formal-letter', label: 'Formal Letter', label_hi: 'औपचारिक पत्र' },
      { id: 'essay', label: 'Essay Writing', label_hi: 'निबंध लेखन' },
      { id: 'story', label: 'Story Continuation', label_hi: 'कहानी विस्तार' },
      { id: 'description', label: 'Descriptive Writing', label_hi: 'वर्णनात्मक लेखन' },
    ],
  },
}

export default async function ModulePage({ params }: PageProps) {
  if (!MODULE_DATA[params.moduleId]) notFound()

  const user = getServerUser()
  if (!user) return null

  const mod = MODULE_DATA[params.moduleId]
  const moduleId = params.moduleId as Module

  const db = createServiceClient()
  const { data: progressData } = await db
    .from('module_progress')
    .select('*')
    .eq('user_id', user.userId)
    .eq('module', moduleId)

  const topicProgress = new Map(
    ((progressData ?? []) as ModuleProgress[]).map((p) => [p.topic, p])
  )
  const completedCount = Array.from(topicProgress.values()).filter((p) => p.completed).length
  const overallPct = percentOf(completedCount, mod.topics.length)

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Module header */}
      <div className="fade-up glass rounded-2xl p-6 border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-40 h-40 bg-orange/5 rounded-full blur-2xl" />
        <div className="flex items-center gap-4 relative mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${mod.color} flex items-center justify-center shadow-card`}>
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h2 className="display text-2xl text-white">{mod.label}</h2>
            <p className="hindi text-white/50 text-sm">{mod.label_hi}</p>
            <p className="text-white/40 text-xs mt-0.5">{mod.desc}</p>
          </div>
        </div>
        <ProgressBar value={overallPct} color="orange" height="md" label={`${completedCount} of ${mod.topics.length} topics completed`} showPercent />
      </div>

      {/* Topics list */}
      <div className="fade-up-1 space-y-3">
        <h3 className="display text-lg text-white">Topics</h3>
        {mod.topics.map((topic, i) => {
          const tp = topicProgress.get(topic.id)
          const isCompleted = tp?.completed ?? false
          const score = tp?.score ?? null

          return (
            <div key={topic.id} className="glass rounded-2xl border border-white/10 overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isCompleted ? 'bg-green-500/20 border border-green-500/40' : 'bg-white/5 border border-white/10'}`}>
                  {isCompleted ? (
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-white/30 text-xs font-semibold">{i + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white">{topic.label}</p>
                  <p className="hindi text-white/40 text-sm">{topic.label_hi}</p>
                </div>
                {score !== null && (
                  <div className="flex items-center gap-2">
                    <ProgressBar value={score} color="auto" height="sm" className="w-20 hidden sm:block" />
                    <span className={`text-xs font-semibold ${score >= 80 ? 'text-green-400' : score >= 60 ? 'text-orange' : 'text-red-400'}`}>{score}%</span>
                  </div>
                )}
                <div className="flex items-center gap-2 ml-2">
                  <Link
                    href={`/lesson/${topic.id}?module=${moduleId}`}
                    className="px-3 py-1.5 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-xs font-medium transition-all"
                  >
                    Learn
                  </Link>
                  <Link
                    href={`/quiz/${moduleId}?topic=${topic.id}`}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange to-saffron text-white text-xs font-semibold hover:shadow-orange transition-all"
                  >
                    Quiz
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
