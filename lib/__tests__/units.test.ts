import { describe, expect, it } from 'vitest'

import { formatByUnitType } from '../units'

describe('formatByUnitType', () => {
  it('formats percentages with one decimal', () => {
    expect(formatByUnitType(42.4242, '%')).toBe('42.4%')
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
  })

  it('falls back to the raw string for TEXT', () => {
    expect(formatByUnitType('hello', 'TEXT')).toBe('hello')
  })

  it('returns an empty string for nullish values', () => {
    expect(formatByUnitType('', 'TEXT')).toBe('')
    expect(formatByUnitType(null as any, 'TEXT')).toBe('')
  })
})
