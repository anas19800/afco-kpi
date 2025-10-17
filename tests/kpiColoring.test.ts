import { describe, expect, it } from 'vitest';
import { colorClass } from '@/lib/kpiColoring';

describe('colorClass', () => {
  const bands = { level4: 90, level3: 75, level2: 60, level1: 40 };

  it('classifies high direction correctly', () => {
    expect(colorClass(95, bands, 'HIGH')).toBe('level-4');
    expect(colorClass(80, bands, 'HIGH')).toBe('level-3');
    expect(colorClass(65, bands, 'HIGH')).toBe('level-2');
    expect(colorClass(30, bands, 'HIGH')).toBe('level-1');
  });

  it('classifies low direction correctly', () => {
    expect(colorClass(20, bands, 'LOW')).toBe('level-4');
    expect(colorClass(65, bands, 'LOW')).toBe('level-2');
    expect(colorClass(95, bands, 'LOW')).toBe('level-1');
  });

  it('ignores zeros when configured', () => {
    expect(colorClass(0, bands, 'HIGH')).toBe('none');
  });

  it('handles string inputs', () => {
    expect(colorClass(' 80 ', bands, 'HIGH')).toBe('level-3');
  });
});
