'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import TopBar from '@/components/TopBar'
import type { AuthPayload } from '@/lib/types'

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/progress': 'My Progress',
  '/track/psle': 'PSLE Track',
  '/track/olevel': 'O-Level Track',
  '/module/grammar': 'Grammar',
  '/module/vocabulary': 'Vocabulary',
  '/module/comprehension': 'Comprehension',
  '/module/writing': 'Writing',
  '/teacher': 'Teacher Dashboard',
  '/teacher/students/new': 'Add Student',
}

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/quiz/')) return 'Quiz'
  if (pathname.startsWith('/exam/')) return 'Exam'
  if (pathname.startsWith('/lesson/')) return 'Lesson'
  if (pathname.startsWith('/teacher/students/')) return 'Student Detail'
  return 'Aakar Hindi'
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthPayload | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [streakDays, setStreakDays] = useState<number | undefined>(undefined)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => {
        if (!r.ok) {
          router.push('/login')
          return null
        }
        return r.json() as Promise<AuthPayload>
      })
      .then((data) => {
        if (data) setUser(data)
      })
      .catch(() => router.push('/login'))
  }, [router])

  useEffect(() => {
    if (!user) return
    fetch('/api/progress/quiz')
      .then((r) => r.json())
      .catch(() => null)
  }, [user])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  if (!user) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange to-saffron flex items-center justify-center float">
            <span className="yatra text-xl text-white">अ</span>
          </div>
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange/60 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-orange/60 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-orange/60 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-navy">
      <Sidebar
        user={user}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          user={user}
          title={getPageTitle(pathname)}
          streakDays={streakDays}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
