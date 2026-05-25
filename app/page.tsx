import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aakar Hindi — Master Hindi. Excel in Exams.',
  description: 'Structured PSLE & O-Level Hindi preparation for Singapore students. 150+ exam papers, 1000+ vocabulary, instant answer explanations.',
}

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Dual Track System',
    desc: 'PSLE (P3–P6) and O-Level (Sec 1–4) — each track with 3 levels, 50 exam papers per level, and equal depth of coverage.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Answer Explanations',
    desc: 'Every question explained in Hindi and English. Wrong options analysed. Students understand why, not just what.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Exam Simulation',
    desc: 'Timed papers that mirror the exact MOE exam format — Grammar, Cloze, Comprehension, Vocabulary, all in one session.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Progress Tracking',
    desc: "Streak counter, avg score, papers done — all tracked. Teacher sees every student's performance at a glance.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Private & Secure',
    desc: 'Each student gets their own password. No one else can see their scores. Teacher controls all accounts.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
    ),
    title: 'Worksheets & PDFs',
    desc: 'Downloadable practice papers, vocabulary lists, writing guides — everything students need offline too.',
  },
]

const STATS = [
  { value: '150+', label: 'Exam Papers' },
  { value: '1,500+', label: 'Questions' },
  { value: '500+', label: 'Cloze Passages' },
  { value: '1,000+', label: 'Vocabulary Items' },
]

const TRACKS = [
  {
    id: 'psle',
    label: 'PSLE Hindi',
    label_hi: 'प्राथमिक हिंदी',
    grades: 'Primary 3 – 6',
    board: 'MOE Singapore',
    color: 'from-blue to-blue-mid',
    features: ['Tenses, Adjectives, Synonyms, Antonyms', 'Idioms, Proverbs, Word Pairs', 'Cloze & OE Comprehension', 'Guided & Picture Essay writing'],
    stats: ['3 Levels', '50 Papers/Level', '100+ Questions/Level', '4 Modules'],
  },
  {
    id: 'olevel',
    label: 'O-Level Hindi',
    label_hi: 'माध्यमिक हिंदी',
    grades: 'Secondary 1 – 4',
    board: 'Singapore-Cambridge',
    color: 'from-orange to-saffron',
    features: ['Sandhi (Word Combination/Separation)', 'Sentence Transformation (Active/Passive)', '800–1000 Idioms, Proverbs, Word Pairs', 'Formal/Informal Letters & Essays'],
    stats: ['3 Levels', '50 Papers/Level', '100+ Questions/Level', '4 Modules'],
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-navy text-white">
      {/* Nav */}
      <nav className="border-b border-white/10 px-6 h-16 flex items-center sticky top-0 z-20 bg-navy/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange to-saffron flex items-center justify-center">
            <span className="yatra text-white font-bold text-base">अ</span>
          </div>
          <span className="yatra text-xl text-white">Aakar Hindi</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/login" className="text-white/60 hover:text-white text-sm font-medium transition-colors px-4 py-2">
            Log in
          </Link>
          <Link href="/login" className="bg-gradient-to-r from-orange to-saffron text-white text-sm font-semibold px-5 py-2 rounded-xl hover:shadow-orange transition-all duration-200">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 py-24 text-center overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 dot-pattern opacity-40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-orange/10 border border-orange/30 text-orange text-sm font-semibold px-4 py-1.5 rounded-full mb-8 fade-up">
            🇸🇬 &nbsp;Singapore&apos;s Hindi Learning Platform
          </div>

          <h1 className="display fade-up-1 mb-4" style={{ fontSize: 'clamp(2.5rem,6vw,4rem)', lineHeight: 1.1 }}>
            Master Hindi.<br />
            <span className="text-orange">Excel in Exams.</span>
          </h1>

          <p className="fade-up-2 text-white/60 max-w-2xl mx-auto mb-3" style={{ fontSize: 'clamp(1rem,2vw,1.2rem)', lineHeight: 1.7 }}>
            Structured PSLE &amp; O-Level Hindi prep — 150 papers, 1,000+ vocabulary,
            500 cloze passages, with instant answer explanations in Hindi and English.
          </p>

          <p className="hindi fade-up-2 text-orange/80 text-lg mb-10">
            &ldquo;ज्ञान ही शक्ति है।&rdquo; — Knowledge is Power.
          </p>

          <div className="fade-up-3 flex flex-wrap justify-center gap-4 mb-16">
            <Link
              href="/login"
              className="bg-gradient-to-r from-orange to-saffron text-white font-bold px-8 py-4 rounded-xl hover:shadow-orange-lg transition-all duration-200 text-base"
            >
              Start Learning →
            </Link>
            <a
              href="#tracks"
              className="glass border border-white/20 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all duration-200 text-base"
            >
              See Curriculum
            </a>
          </div>

          {/* Stats */}
          <div className="fade-up-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="glass border border-white/10 rounded-2xl p-4">
                <div className="display text-3xl text-white mb-1">{s.value}</div>
                <div className="text-white/40 text-xs">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section id="tracks" className="px-6 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="display text-center text-3xl mb-2">Two Complete Tracks</h2>
          <p className="text-center text-white/40 mb-12">Equal depth, equal quality. Tailored to each exam format.</p>
          <div className="grid md:grid-cols-2 gap-6">
            {TRACKS.map((track) => (
              <div key={track.id} className="glass rounded-2xl overflow-hidden border border-white/10">
                <div className={`p-6 bg-gradient-to-br ${track.color}`}>
                  <p className="hindi text-white/70 text-sm mb-1">{track.label_hi}</p>
                  <h3 className="display text-2xl text-white mb-1">{track.label}</h3>
                  <p className="text-white/60 text-sm">{track.grades} · {track.board}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-2 mb-6">
                    {track.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-white/70">
                        <svg className="w-4 h-4 text-orange mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    {track.stats.map((s) => (
                      <div key={s} className="bg-white/5 rounded-xl px-3 py-2 text-center">
                        <div className="text-white font-bold text-sm">{s}</div>
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/login"
                    className={`block text-center py-2.5 rounded-xl font-semibold text-white text-sm bg-gradient-to-r ${track.color} hover:shadow-card-hover transition-all duration-200`}
                  >
                    Explore {track.label} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="display text-center text-3xl mb-2">Everything You Need to Score</h2>
          <p className="text-center text-white/40 mb-12">No tuition centre required. All in one platform.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="glass rounded-2xl p-5 border border-white/10 hover:border-orange/30 transition-colors duration-200">
                <div className="w-10 h-10 rounded-xl bg-blue-mid/60 flex items-center justify-center text-orange mb-4">
                  {f.icon}
                </div>
                <h4 className="font-semibold text-white mb-2">{f.title}</h4>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center border-t border-white/5">
        <div className="max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange to-saffron flex items-center justify-center mx-auto mb-6 float">
            <span className="yatra text-3xl text-white">अ</span>
          </div>
          <h2 className="display text-3xl mb-4">Ready to begin?</h2>
          <p className="text-white/40 mb-8">Your teacher will give you a username and password. Enter them below to start.</p>
          <Link
            href="/login"
            className="inline-block bg-gradient-to-r from-orange to-saffron text-white font-bold px-10 py-4 rounded-xl hover:shadow-orange-lg transition-all duration-200 text-base"
          >
            Sign In to Aakar Hindi
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center">
        <div className="yatra text-orange/70 text-lg mb-2">Aakar Hindi</div>
        <p className="hindi text-white/20 text-sm">हिंदी सीखो, आगे बढ़ो।</p>
        <p className="text-white/20 text-xs mt-2">© {new Date().getFullYear()} Aakar Hindi Tuition Centre · Singapore</p>
      </footer>
    </div>
  )
}
