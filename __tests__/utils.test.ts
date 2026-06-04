import { describe, it, expect } from 'vitest'
import { cn, formatDate, scoreColor, scoreBg, scoreLabel, trackForGrade, percentOf, formatSeconds } from '../lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })
  it('filters falsy values', () => {
    expect(cn('foo', false, null, undefined, 'bar')).toBe('foo bar')
  })
})

describe('trackForGrade', () => {
  it('returns psle for primary grades', () => {
    expect(trackForGrade('P3')).toBe('psle')
    expect(trackForGrade('P6')).toBe('psle')
  })
  it('returns olevel for secondary grades', () => {
    expect(trackForGrade('Sec 1')).toBe('olevel')
    expect(trackForGrade('Sec 4')).toBe('olevel')
  })
})

describe('scoreColor', () => {
  it('returns green for 80+', () => {
    expect(scoreColor(80)).toBe('text-green-400')
    expect(scoreColor(100)).toBe('text-green-400')
  })
  it('returns orange for 60–79', () => {
    expect(scoreColor(60)).toBe('text-orange-400')
    expect(scoreColor(79)).toBe('text-orange-400')
  })
  it('returns red for below 60', () => {
    expect(scoreColor(59)).toBe('text-red-400')
    expect(scoreColor(0)).toBe('text-red-400')
  })
})

describe('scoreLabel', () => {
  it('returns Excellent for 80+', () => {
    expect(scoreLabel(80)).toBe('Excellent')
  })
  it('returns Good for 60–79', () => {
    expect(scoreLabel(70)).toBe('Good')
  })
  it('returns Needs Work for 40–59', () => {
    expect(scoreLabel(50)).toBe('Needs Work')
  })
  it('returns Keep Trying below 40', () => {
    expect(scoreLabel(30)).toBe('Keep Trying')
  })
})

describe('percentOf', () => {
  it('calculates percentage correctly', () => {
    expect(percentOf(8, 10)).toBe(80)
    expect(percentOf(0, 10)).toBe(0)
  })
  it('returns 0 when total is 0', () => {
    expect(percentOf(5, 0)).toBe(0)
  })
})

describe('formatSeconds', () => {
  it('formats seconds to mm:ss', () => {
    expect(formatSeconds(90)).toBe('1:30')
    expect(formatSeconds(3661)).toBe('61:01')
    expect(formatSeconds(60)).toBe('1:00')
  })
})
