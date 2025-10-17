import { describe, expect, it } from 'vitest'

import { formatByUnitType } from '../units'

describe('formatByUnitType', () => {
  it('formats percentages with one decimal', () => {
    expect(formatByUnitType(42.4242, '%')).toBe('42.4%')
    expect(formatByUnitType(' 42.5 ', '%')).toBe('42.5%')
  })

  it('formats SAR currency using ar-SA locale', () => {
    const expected = new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      maximumFractionDigits: 0,
    }).format(1234)
    expect(formatByUnitType(1234, 'SAR')).toBe(expected)
  })

  it('adds grouping for plain numbers', () => {
    expect(formatByUnitType(9876543, '#')).toBe('9,876,543')
    expect(formatByUnitType(' 1000 ', '#')).toBe('1,000')
  })

  it('falls back to the raw string for TEXT', () => {
    expect(formatByUnitType('hello', 'TEXT')).toBe('hello')
  })

  it('returns an empty string for nullish or blank values', () => {
    expect(formatByUnitType('', 'TEXT')).toBe('')
    expect(formatByUnitType('   ', 'TEXT')).toBe('')
    expect(formatByUnitType(null as any, 'TEXT')).toBe('')
    expect(formatByUnitType(undefined as any, 'TEXT')).toBe('')
  })

  it('falls back to the trimmed string when formatting fails', () => {
    expect(formatByUnitType('N/A', '%')).toBe('N/A')
    expect(formatByUnitType('error', 'SAR')).toBe('error')
    expect(formatByUnitType('unknown', '#')).toBe('unknown')
  })
})
