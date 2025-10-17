export type Direction = 'HIGH' | 'LOW';

export type Bands = {
  level4: number;
  level3: number;
  level2: number;
  level1: number;
};

export function colorClass(
  rawValue: number | string | null | undefined,
  bands: Bands,
  direction: Direction,
  options?: { treatZeroAsEmpty?: boolean }
): 'level-4' | 'level-3' | 'level-2' | 'level-1' | 'none' {
  const treatZeroAsEmpty = options?.treatZeroAsEmpty ?? true;
  if (rawValue === null || rawValue === undefined || rawValue === '') {
    return 'none';
  }

  const value = typeof rawValue === 'string' ? Number(rawValue.trim()) : Number(rawValue);

  if (Number.isNaN(value)) {
    return 'none';
  }

  if (treatZeroAsEmpty && value === 0) {
    return 'none';
  }

  if (direction === 'HIGH') {
    if (value >= bands.level4) return 'level-4';
    if (value >= bands.level3) return 'level-3';
    if (value >= bands.level2) return 'level-2';
    return 'level-1';
  }

  if (value <= bands.level4) return 'level-4';
  if (value <= bands.level3) return 'level-3';
  if (value <= bands.level2) return 'level-2';
  return 'level-1';
}

export function summarizeLevels(counts: Record<'level-1' | 'level-2' | 'level-3' | 'level-4', number>) {
  const total = counts['level-1'] + counts['level-2'] + counts['level-3'] + counts['level-4'];
  const score =
    (counts['level-4'] * 4 + counts['level-3'] * 3 + counts['level-2'] * 2 + counts['level-1']) /
    (total === 0 ? 1 : total * 4);
  return { total, score };
}
