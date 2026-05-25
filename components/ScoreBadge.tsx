import { cn, scoreLabel } from '@/lib/utils'

interface ScoreBadgeProps {
  score: number
  total?: number
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

function badgeColor(score: number) {
  if (score >= 80) return { bg: 'bg-green-500/15 border-green-500/40', text: 'text-green-400' }
  if (score >= 60) return { bg: 'bg-orange/15 border-orange/40', text: 'text-orange' }
  return { bg: 'bg-red-500/15 border-red-500/40', text: 'text-red-400' }
}

const sizeMap = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-2',
}

export default function ScoreBadge({ score, total, size = 'md', showLabel = false, className }: ScoreBadgeProps) {
  const pct = total !== undefined ? Math.round((score / total) * 100) : score
  const { bg, text } = badgeColor(pct)

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full border font-semibold', bg, text, sizeMap[size], className)}
      aria-label={`Score: ${pct}%${showLabel ? ` — ${scoreLabel(pct)}` : ''}`}
    >
      {total !== undefined ? `${score}/${total}` : `${score}%`}
      {showLabel && (
        <span className="font-normal opacity-70">{scoreLabel(pct)}</span>
      )}
    </span>
  )
}
