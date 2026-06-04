import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServerUser } from '@/lib/auth'
import { getLesson } from '@/data/index'
import type { Lesson, LessonBlock } from '@/lib/types'
import { cn } from '@/lib/utils'

interface PageProps {
  params: { topicId: string }
  searchParams: { module?: string }
}

// Sample lesson content – in production this would come from the database
const LESSON_DATA: Record<string, Lesson> = {
  nouns: {
    id: 'nouns',
    title: 'Nouns & Gender',
    title_hindi: 'संज्ञा और लिंग',
    module: 'grammar',
    topic: 'nouns',
    track: 'psle',
    level: 'foundational',
    content: [
      { type: 'text', content: 'In Hindi, every noun (संज्ञा) has a grammatical gender — either masculine (पुल्लिंग) or feminine (स्त्रीलिंग). Unlike English, there is no neutral gender in Hindi.' },
      { type: 'rule', content: 'Most nouns ending in आ (aa) are masculine. Most nouns ending in ई/इ (ee/i) are feminine.', note: 'There are exceptions — always learn the gender alongside the noun.' },
      { type: 'hindi', content: 'लड़का (boy) — पुल्लिंग', translation: 'Boy — Masculine' },
      { type: 'hindi', content: 'लड़की (girl) — स्त्रीलिंग', translation: 'Girl — Feminine' },
      { type: 'example', content: 'यह लड़का अच्छा है।', translation: 'This boy is good. (masculine adjective form)', note: 'Notice अच्छा agrees with the masculine noun लड़का' },
      { type: 'example', content: 'यह लड़की अच्छी है।', translation: 'This girl is good. (feminine adjective form)', note: 'Notice अच्छी agrees with the feminine noun लड़की' },
      { type: 'tip', content: 'When in doubt, look up the noun in a dictionary. It will always indicate पु. (masculine) or स्त्री. (feminine).' },
      { type: 'table', content: JSON.stringify([['Masculine (पुल्लिंग)', 'Feminine (स्त्रीलिंग)'], ['लड़का (boy)', 'लड़की (girl)'], ['आदमी (man)', 'औरत (woman)'], ['कुत्ता (dog)', 'कुत्ती (female dog)'], ['राजा (king)', 'रानी (queen)']]) },
    ],
  },
  verbs: {
    id: 'verbs',
    title: 'Verbs & Tense',
    title_hindi: 'क्रिया और काल',
    module: 'grammar',
    topic: 'verbs',
    track: 'psle',
    level: 'foundational',
    content: [
      { type: 'text', content: 'Hindi verbs (क्रिया) change form based on tense (काल), gender, and number. The three main tenses are present (वर्तमान काल), past (भूतकाल), and future (भविष्य काल).' },
      { type: 'rule', content: 'The verb stem is found by removing ना from the infinitive form. For example: खाना → खा (stem)', note: 'The stem is the base from which all conjugated forms are built.' },
      { type: 'table', content: JSON.stringify([['Person', 'Present', 'Past', 'Future'], ['मैं (I)', 'खाता/खाती हूँ', 'खाया/खाई', 'खाऊँगा/खाऊँगी'], ['तुम (you)', 'खाते/खाती हो', 'खाया/खाई', 'खाओगे/खाओगी'], ['वह (he/she)', 'खाता/खाती है', 'खाया/खाई', 'खाएगा/खाएगी']]) },
    ],
  },
}

function renderBlock(block: LessonBlock, index: number) {
  switch (block.type) {
    case 'text':
      return (
        <p key={index} className="text-white/80 leading-relaxed">
          {block.content}
        </p>
      )
    case 'hindi':
      return (
        <div key={index} className="bg-blue-mid/20 border-l-4 border-blue rounded-r-xl px-5 py-4">
          <p className="hindi text-xl text-blue-100 mb-1">{block.content}</p>
          {block.translation && <p className="text-white/50 text-sm">{block.translation}</p>}
        </div>
      )
    case 'example':
      return (
        <div key={index} className="glass rounded-xl px-5 py-4 border border-white/10">
          <p className="text-xs font-semibold text-orange/70 uppercase tracking-wider mb-2">Example</p>
          <p className="hindi text-lg text-white mb-1">{block.content}</p>
          {block.translation && <p className="text-white/60 text-sm mb-1">{block.translation}</p>}
          {block.note && <p className="text-white/40 text-xs italic">{block.note}</p>}
        </div>
      )
    case 'rule':
      return (
        <div key={index} className="bg-orange/10 border border-orange/30 rounded-xl px-5 py-4">
          <div className="flex items-start gap-2.5">
            <svg className="w-5 h-5 text-orange mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-orange mb-1">Rule</p>
              <p className="text-white/80 text-sm">{block.content}</p>
              {block.note && <p className="text-white/40 text-xs mt-1 italic">{block.note}</p>}
            </div>
          </div>
        </div>
      )
    case 'tip':
      return (
        <div key={index} className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-5 py-4">
          <div className="flex items-start gap-2.5">
            <svg className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-emerald-400 mb-1">Tip</p>
              <p className="text-white/80 text-sm">{block.content}</p>
            </div>
          </div>
        </div>
      )
    case 'table': {
      let rows: string[][] = []
      try {
        rows = JSON.parse(block.content) as string[][]
      } catch {
        return null
      }
      return (
        <div key={index} className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                {rows[0]?.map((header, j) => (
                  <th key={j} className="text-left px-4 py-2.5 bg-blue-mid/30 text-white/70 font-semibold first:rounded-tl-xl last:rounded-tr-xl">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(1).map((row, j) => (
                <tr key={j} className="border-b border-white/5">
                  {row.map((cell, k) => (
                    <td key={k} className="px-4 py-3 hindi text-white/80">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }
    default:
      return null
  }
}

export default async function LessonPage({ params, searchParams }: PageProps) {
  const user = getServerUser()
  const track = user?.track ?? 'psle'
  // Try real data first; fall back to hardcoded samples
  const lesson: Lesson | undefined = getLesson(params.topicId, track as 'psle' | 'olevel') ?? LESSON_DATA[params.topicId]
  if (!lesson) notFound()

  const moduleId = searchParams.module ?? lesson.module

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="fade-up">
        <Link href={`/module/${moduleId}`} className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to module
        </Link>
        <div className="glass rounded-2xl p-6 border border-white/10">
          <span className="text-xs font-semibold text-orange/70 uppercase tracking-wider">{lesson.module} · {lesson.level}</span>
          <h1 className="display text-2xl text-white mt-2 mb-1">{lesson.title}</h1>
          <p className="hindi text-white/50">{lesson.title_hindi}</p>
        </div>
      </div>

      {/* Content blocks */}
      <div className="fade-up-1 space-y-4">
        {lesson.content.map((block, i) => renderBlock(block, i))}
      </div>

      {/* CTA */}
      <div className="fade-up-2 flex flex-col sm:flex-row gap-3 pt-2">
        <Link
          href={`/quiz/${moduleId}?topic=${params.topicId}`}
          className="flex-1 bg-gradient-to-r from-orange to-saffron text-white font-semibold py-3.5 rounded-xl hover:shadow-orange transition-all duration-200 text-center"
        >
          Practice Quiz →
        </Link>
        <Link
          href={`/module/${moduleId}`}
          className="flex-1 glass border border-white/20 text-white/70 font-medium py-3.5 rounded-xl hover:border-white/40 hover:text-white transition-all duration-200 text-center"
        >
          Back to Module
        </Link>
      </div>
    </div>
  )
}
