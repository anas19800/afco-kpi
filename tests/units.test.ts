import { describe, expect, it } from 'vitest';
import { formatValue, normalizePercentage } from '@/lib/units';

describe('units', () => {
  it('normalizes percent from 0-1 to 0-100', () => {
    expect(normalizePercentage(0.5, 1)).toBe(50);
    expect(normalizePercentage(50, 100)).toBe(50);
  });

  it('formats SAR currency', () => {
    const formatted = formatValue(123456.78, 'SAR', { locale: 'en' });
    expect(formatted).toContain('SAR');
  });

  it('returns blank for empty values', () => {
    expect(formatValue(null, '%')).toBe('');
  });
});
