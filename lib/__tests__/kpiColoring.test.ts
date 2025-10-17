import { describe, expect, it } from 'vitest'

import { colorClass } from '../kpiColoring'

const bands = { level4: 90, level3: 75, level2: 50, level1: 0 }

describe('colorClass', () => {
  it('returns none for empty values', () => {
    expect(colorClass(null, bands, 'HIGH')).toBe('none')
    expect(colorClass(undefined, bands, 'HIGH')).toBe('none')
    expect(colorClass('', bands, 'HIGH')).toBe('none')
    expect(colorClass(0, bands, 'HIGH')).toBe('none')
  })

  it('evaluates HIGH direction thresholds from top to bottom', () => {
    expect(colorClass(95, bands, 'HIGH', false)).toBe('level-4')
    expect(colorClass(80, bands, 'HIGH', false)).toBe('level-3')
    expect(colorClass(60, bands, 'HIGH', false)).toBe('level-2')
    expect(colorClass(10, bands, 'HIGH', false)).toBe('level-1')
  })

  it('evaluates LOW direction thresholds from bottom to top', () => {
    const inverted = { level4: 10, level3: 20, level2: 30, level1: 100 }
    expect(colorClass(5, inverted, 'LOW', false)).toBe('level-4')
    expect(colorClass(15, inverted, 'LOW', false)).toBe('level-3')
    expect(colorClass(25, inverted, 'LOW', false)).toBe('level-2')
    expect(colorClass(50, inverted, 'LOW', false)).toBe('level-1')
  })
})
