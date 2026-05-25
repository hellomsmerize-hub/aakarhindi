import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number // 0–100
  color?: 'orange' | 'blue' | 'green' | 'red' | 'auto'
  height?: 'sm' | 'md' | 'lg'
  label?: string
  showPercent?: boolean
  className?: string
}

const colorMap: Record<string, string> = {
  orange: 'bg-gradient-to-r from-orange to-saffron',
  blue: 'bg-gradient-to-r from-blue to-blue-mid',
  green: 'bg-gradient-to-r from-green-500 to-emerald-400',
  red: 'bg-gradient-to-r from-red-600 to-red-400',
}

const heightMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

function autoColor(value: number): string {
  if (value >= 80) return colorMap.green
  if (value >= 60) return colorMap.orange
  return colorMap.red
}

export default function ProgressBar({
  value,
  color = 'orange',
  height = 'md',
  label,
  showPercent = false,
  className,
}: ProgressBarProps) {
  const clampedValue = Math.max(0, Math.min(100, value))
  const fillColor = color === 'auto' ? autoColor(clampedValue) : colorMap[color]

  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs text-white/60">{label}</span>}
          {showPercent && (
            <span className="text-xs font-semibold text-white/80 ml-auto">{clampedValue}%</span>
          )}
        </div>
      )}
      <div
        className={cn('progress-bar-track', heightMap[height])}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? `Progress: ${clampedValue}%`}
      >
        <div
          className={cn('progress-bar-fill', heightMap[height], fillColor)}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  )
}
