'use client'

import type { AuthPayload } from '@/lib/types'

interface TopBarProps {
  user: AuthPayload
  title: string
  streakDays?: number
  onMenuClick: () => void
}

export default function TopBar({ user, title, streakDays, onMenuClick }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-navy/80 backdrop-blur-md border-b border-white/10 px-4 lg:px-6 h-16 flex items-center gap-4">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all"
        aria-label="Open navigation menu"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Page title */}
      <h1 className="display text-white text-lg lg:text-xl font-medium flex-1 truncate">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Streak badge */}
        {streakDays !== undefined && streakDays > 0 && (
          <div
            className="hidden sm:flex items-center gap-1.5 bg-orange/20 border border-orange/30 rounded-xl px-3 py-1.5"
            title={`${streakDays}-day streak`}
          >
            <span className="text-base" aria-hidden="true">🔥</span>
            <span className="text-orange text-sm font-semibold">{streakDays}</span>
            <span className="text-orange/70 text-xs">day streak</span>
          </div>
        )}

        {/* Role badge */}
        {user.role === 'teacher' && (
          <div className="hidden sm:flex items-center gap-1.5 bg-blue-mid/40 border border-blue-600/40 rounded-xl px-3 py-1.5">
            <svg className="w-4 h-4 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-blue-200 text-xs font-medium">Teacher</span>
          </div>
        )}
      </div>
    </header>
  )
}
