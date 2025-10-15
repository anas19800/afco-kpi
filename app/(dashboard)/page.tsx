import { prisma } from '@/lib/db'
import KpiHeatmap from '@/components/KpiHeatmap'
import { KpiCard } from '@/components/KpiCard'

export default async function DashboardPage(){
  const kpi = await prisma.kpiDefinition.findUnique({ where: { code: 'SALES_ACH' } })
  if(!kpi) return <div>No KPI</div>

  const actuals = await prisma.$queryRaw<any[]>`SELECT a.period_key, b.code as brand_code, a.value FROM "Actual" a JOIN "Brand" b ON a."brandId"=b.id WHERE a."kpiId"=${kpi.id}`
  const bandsRaw = await prisma.targetBand.findMany({ where: { kpiId: kpi.id, period_type: 'Monthly' } })
  const bandByPeriod: Record<string,{ level4:number; level3:number; level2:number; level1:number }> = {}
  for(const r of bandsRaw){ bandByPeriod[r.period_key] = { level4:r.level4, level3:r.level3, level2:r.level2, level1:r.level1 } }
  const data = actuals.map(a=>({ period_key:a.period_key, brand_code:a.brand_code, value:Number(a.value), unit_type:kpi.unit_type, direction:kpi.direction as any, bands: bandByPeriod[a.period_key] || {level4:0,level3:0,level2:0,level1:0} }))

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard title="Cells" value={actuals.length} color="green" />
        <KpiCard title="Locale" value="AR" />
      </div>
      <KpiHeatmap data={data} />
    </div>
  )
}
