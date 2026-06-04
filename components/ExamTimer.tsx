'use client'

import { useEffect, useState, useCallback } from 'react'
import { formatSeconds } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ExamTimerProps {
  totalSeconds: number
  onExpire: () => void
  className?: string
}

export default function ExamTimer({ totalSeconds, onExpire, className }: ExamTimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds)
  const [expired, setExpired] = useState(false)

  const handleExpire = useCallback(() => {
    setExpired(true)
    onExpire()
  }, [onExpire])

  useEffect(() => {
    if (expired) return
    if (remaining <= 0) {
      handleExpire()
      return
    }
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleExpire()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [expired, remaining, handleExpire])

  const isUrgent = remaining <= 600 // last 10 minutes
  const isCritical = remaining <= 60 // last 1 minute
  const pct = Math.round((remaining / totalSeconds) * 100)

  return (
    <div
      className={cn(
        'flex items-center gap-2 px-4 py-2.5 rounded-xl border font-mono transition-all duration-300',
        isCritical
          ? 'bg-red-500/20 border-red-500/50 animate-pulse-slow'
          : isUrgent
          ? 'bg-orange/15 border-orange/40'
          : 'bg-white/5 border-white/20',
        className
      )}
      role="timer"
      aria-live="off"
      aria-label={`Time remaining: ${formatSeconds(remaining)}`}
    >
      <svg
        className={cn('w-4 h-4', isCritical ? 'text-red-400' : isUrgent ? 'text-orange' : 'text-white/50')}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span
        className={cn(
          'text-sm font-semibold tabular-nums',
          isCritical ? 'text-red-400' : isUrgent ? 'text-orange' : 'text-white/80'
        )}
      >
        {formatSeconds(remaining)}
      </span>
      {isUrgent && !isCritical && (
        <span className="text-orange/70 text-xs">left</span>
      )}
      {isCritical && (
        <span className="text-red-400 text-xs font-medium">Hurry!</span>
      )}
      {/* Mini progress */}
      <div className="hidden sm:block w-16 h-1 rounded-full bg-white/10 overflow-hidden ml-1">
        <div
          className={cn('h-full rounded-full transition-all duration-1000', isCritical ? 'bg-red-500' : isUrgent ? 'bg-orange' : 'bg-blue')}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
