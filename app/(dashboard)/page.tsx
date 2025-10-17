import KpiHeatmap from '@/components/KpiHeatmap'
import { KpiCard } from '@/components/KpiCard'
import { sampleData } from '@/lib/sampleData'
import { formatByUnitType } from '@/lib/units'

export default function DashboardPage() {
  const { kpiDefinition, heatmapCells, months, brands } = sampleData

  const brandLookup = new Map(brands.map((brand) => [brand.code, brand]))
  const populatedCells = heatmapCells.filter((cell) => cell.value != null)
  const totalCells = heatmapCells.length

  const averageValue =
    populatedCells.reduce((sum, cell) => sum + (cell.value ?? 0), 0) /
    (populatedCells.length || 1)

  const latestMonth = months[months.length - 1]
  const latestLeaders = populatedCells
    .filter((cell) => cell.period_key === latestMonth)
    .sort((a, b) => (b.value ?? 0) - (a.value ?? 0))

  const topPerformer = latestLeaders[0]
  const topBrand = topPerformer ? brandLookup.get(topPerformer.brand_code) : undefined

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="KPI"
          value={kpiDefinition.name_en}
          hint={`(${kpiDefinition.name_ar})`}
          color="gray"
        />
        <KpiCard
          title="Latest leader"
          value={topBrand ? topBrand.name : '—'}
          hint={
            topPerformer
              ? `${topPerformer.brand_code} • ${latestMonth} • ${formatByUnitType(
                  topPerformer.value,
                  kpiDefinition.unit_type,
                )}`
              : undefined
          }
          color="green"
        />
        <KpiCard
          title="Tracked brands"
          value={brands.length}
          hint="Included in the heatmap"
          color="orange"
        />
        <KpiCard
          title="Average performance"
          value={formatByUnitType(Number(averageValue.toFixed(1)), kpiDefinition.unit_type)}
          hint={`${totalCells} total data points`}
        />
      </div>
      <KpiHeatmap data={heatmapCells} />
    </div>
  )
}
