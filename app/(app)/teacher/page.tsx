'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ScoreBadge from '@/components/ScoreBadge'
import { formatDate } from '@/lib/utils'

interface StudentRow {
  id: string
  username: string
  name: string
  track: 'psle' | 'olevel'
  grade: string
  progress: {
    questions_attempted: number
    avg_score: number
    papers_completed: number
    streak_days: number
    last_active: string | null
  } | null
}

export default function TeacherDashboard() {
  const [students, setStudents] = useState<StudentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [trackFilter, setTrackFilter] = useState<'all' | 'psle' | 'olevel'>('all')
  const [gradeFilter, setGradeFilter] = useState('all')

  useEffect(() => {
    fetch('/api/students')
      .then((r) => r.json() as Promise<StudentRow[]>)
      .then((data) => { setStudents(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.username.toLowerCase().includes(search.toLowerCase())
    const matchesTrack = trackFilter === 'all' || s.track === trackFilter
    const matchesGrade = gradeFilter === 'all' || s.grade === gradeFilter
    return matchesSearch && matchesTrack && matchesGrade
  })

  const grades = Array.from(new Set(students.map((s) => s.grade))).sort()

  const totalStudents = students.length
  const activeToday = students.filter((s) => {
    if (!s.progress?.last_active) return false
    const d = new Date(s.progress.last_active)
    const now = new Date()
    return d.toDateString() === now.toDateString()
  }).length
  const avgScore = students.length > 0
    ? Math.round(students.reduce((a, s) => a + (s.progress?.avg_score ?? 0), 0) / students.length)
    : 0

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Stats */}
      <div className="fade-up grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: totalStudents, color: 'text-blue-300' },
          { label: 'Active Today', value: activeToday, color: 'text-green-400' },
          { label: 'Avg Score', value: `${avgScore}%`, color: 'text-orange' },
          { label: 'PSLE / O-Level', value: `${students.filter(s => s.track === 'psle').length} / ${students.filter(s => s.track === 'olevel').length}`, color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="glass rounded-2xl p-4 border border-white/10">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-white/40 text-xs mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="fade-up-1 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex-1 relative">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search students…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <select
          value={trackFilter}
          onChange={(e) => setTrackFilter(e.target.value as typeof trackFilter)}
          className="input-field w-auto"
        >
          <option value="all">All Tracks</option>
          <option value="psle">PSLE</option>
          <option value="olevel">O-Level</option>
        </select>
        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          className="input-field w-auto"
        >
          <option value="all">All Grades</option>
          {grades.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
        <Link
          href="/teacher/students/new"
          className="shrink-0 bg-gradient-to-r from-orange to-saffron text-white font-semibold px-5 py-3 rounded-xl hover:shadow-orange transition-all flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Student
        </Link>
      </div>

      {/* Table */}
      <div className="fade-up-2 glass rounded-2xl border border-white/10 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-3">
              {[0, 150, 300].map((delay, i) => (
                <div key={i} className="w-2 h-2 rounded-full bg-orange/60 animate-bounce" style={{ animationDelay: `${delay}ms` }} />
              ))}
            </div>
            <p className="text-white/40 text-sm">Loading students…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-white/20 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-white/40 text-sm">No students found</p>
            {search && <p className="text-white/30 text-xs mt-1">Try a different search term</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Track / Grade</th>
                  <th className="hidden md:table-cell">Questions</th>
                  <th className="hidden sm:table-cell">Avg Score</th>
                  <th className="hidden lg:table-cell">Last Active</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-mid to-navy border border-white/20 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-white">{s.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{s.name}</p>
                          <p className="text-white/40 text-xs">@{s.username}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <span className={s.track === 'psle' ? 'badge-psle' : 'badge-olevel'}>
                          {s.track.toUpperCase()}
                        </span>
                        <p className="text-white/40 text-xs mt-0.5">{s.grade}</p>
                      </div>
                    </td>
                    <td className="hidden md:table-cell">
                      <span className="text-white/70">{s.progress?.questions_attempted ?? 0}</span>
                    </td>
                    <td className="hidden sm:table-cell">
                      {s.progress?.avg_score ? (
                        <ScoreBadge score={s.progress.avg_score} size="sm" />
                      ) : (
                        <span className="text-white/30 text-sm">—</span>
                      )}
                    </td>
                    <td className="hidden lg:table-cell text-white/40 text-sm">
                      {s.progress?.last_active ? formatDate(s.progress.last_active) : 'Never'}
                    </td>
                    <td>
                      <Link
                        href={`/teacher/students/${s.id}`}
                        className="inline-flex items-center gap-1.5 text-orange/80 hover:text-orange text-sm font-medium transition-colors"
                      >
                        View
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
