export type Brand = {
  code: string
  name: string
  color: string
}

export type TargetBand = {
  period_key: string
  level4: number
  level3: number
  level2: number
  level1: number
}

export type KpiDefinition = {
  code: string
  name_en: string
  name_ar: string
  unit_type: '%' | 'SAR' | '#' | 'TEXT'
  direction: 'HIGH' | 'LOW'
}

export type HeatmapCell = {
  period_key: string
  brand_code: string
  value: number | null
  unit_type: string
  direction: 'HIGH' | 'LOW'
  bands: {
    level4: number
    level3: number
    level2: number
    level1: number
  }
}

const months = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12']

const brands: Brand[] = [
  { code: 'LCP', name: 'Kthabasa', color: '#0ea5e9' },
  { code: 'PSK', name: 'Bushak', color: '#22c55e' },
  { code: 'OKA', name: 'Okashi', color: '#a855f7' },
  { code: 'CND', name: 'Shake & Dip', color: '#ef4444' },
]

const kpiDefinition: KpiDefinition = {
  code: 'SALES_ACH',
  name_en: 'Sales Achievement',
  name_ar: 'تحقق المبيعات',
  unit_type: '%',
  direction: 'HIGH',
}

const targetBands: TargetBand[] = months.map((period_key, index) => ({
  period_key,
  level4: 92 + Math.min(index, 2),
  level3: 85 + Math.min(index, 3),
  level2: 78 + Math.min(index, 4),
  level1: 68 + Math.min(index, 4),
}))

const bandByPeriod = Object.fromEntries(targetBands.map((band) => [band.period_key, band])) as Record<string, TargetBand>

const valueMatrix: Record<string, (number | null)[]> = {
  LCP: [93, 95, 97, 96, 98, 99],
  PSK: [82, 84, 86, 87, 90, 92],
  OKA: [75, 77, 80, 83, 86, 88],
  CND: [69, 72, 74, 76, 79, 81],
}

const heatmapCells: HeatmapCell[] = months.flatMap((period_key, monthIndex) =>
  brands.map((brand) => {
    const band = bandByPeriod[period_key]
    return {
      period_key,
      brand_code: brand.code,
      value: valueMatrix[brand.code]?.[monthIndex] ?? null,
      unit_type: kpiDefinition.unit_type,
      direction: kpiDefinition.direction,
      bands: {
        level4: band.level4,
        level3: band.level3,
        level2: band.level2,
        level1: band.level1,
      },
    }
  }),
)

export const sampleData = {
  months,
  brands,
  kpiDefinition,
  targetBands,
  heatmapCells,
}
