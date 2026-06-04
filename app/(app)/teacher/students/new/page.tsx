'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { gradeOptions, trackForGrade } from '@/lib/utils'

export default function AddStudentPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    grade: 'P3',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const track = trackForGrade(form.grade)

  function update(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json() as { id?: string; error?: string }
      if (!res.ok) {
        setError(data.error ?? 'Failed to create student.')
        return
      }
      router.push('/teacher')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="fade-up">
        <Link href="/teacher" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>
        <h2 className="display text-2xl text-white">Add New Student</h2>
        <p className="text-white/40 text-sm mt-1">Create a student account with login credentials.</p>
      </div>

      <form onSubmit={handleSubmit} className="fade-up-1 glass rounded-2xl p-6 border border-white/10 space-y-5" noValidate>
        {/* Full name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1.5">
            Full Name <span className="text-orange">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Student's full name"
            className="input-field"
            disabled={saving}
          />
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-white/70 mb-1.5">
            Username <span className="text-orange">*</span>
          </label>
          <input
            id="username"
            type="text"
            required
            value={form.username}
            onChange={(e) => update('username', e.target.value.toLowerCase().replace(/\s/g, ''))}
            placeholder="unique_username"
            className="input-field"
            disabled={saving}
            autoComplete="off"
          />
          <p className="text-white/30 text-xs mt-1">Lowercase only, no spaces.</p>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-1.5">
            Password <span className="text-orange">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={form.password}
              onChange={(e) => update('password', e.target.value)}
              placeholder="Minimum 6 characters"
              className="input-field pr-12"
              disabled={saving}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showPassword ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Grade */}
        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-white/70 mb-1.5">
            Grade / Level <span className="text-orange">*</span>
          </label>
          <select
            id="grade"
            required
            value={form.grade}
            onChange={(e) => update('grade', e.target.value)}
            className="input-field"
            disabled={saving}
          >
            {gradeOptions.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Track preview */}
        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-4 py-3 border border-white/10">
          <svg className="w-4 h-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-white/50 text-sm">Track will be set to</span>
          <span className={track === 'psle' ? 'badge-psle' : 'badge-olevel'}>{track.toUpperCase()}</span>
          <span className="text-white/30 text-xs">based on grade</span>
        </div>

        {/* Error */}
        {error && (
          <div role="alert" className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/teacher"
            className="flex-1 glass border border-white/20 text-white/60 font-medium py-3 rounded-xl hover:border-white/40 hover:text-white transition-all text-center text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving || !form.name || !form.username || !form.password || form.password.length < 6}
            className="flex-1 bg-gradient-to-r from-orange to-saffron text-white font-semibold py-3 rounded-xl hover:shadow-orange transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Creating…
              </>
            ) : 'Create Student'}
          </button>
        </div>
      </form>
    </div>
  )
}
