import { prisma } from '@/lib/prisma';
import { requireSignedIn } from '@/lib/auth';
import { KpiHeatmap } from '@/components/KpiHeatmap';
import { BrandLegend } from '@/components/BrandLegend';
import { KpiCard } from '@/components/KpiCard';
import { colorClass, summarizeLevels } from '@/lib/kpiColoring';
import { formatValue } from '@/lib/units';

export default async function DashboardPage() {
  requireSignedIn();
  const brands = await prisma.brand.findMany({ orderBy: { name: 'asc' } });
  const kpis = await prisma.kpiDefinition.findMany({ orderBy: { code: 'asc' } });
  const kpi = kpis[0];
  if (!kpi) {
    return <p className="text-slate-300">No KPI definitions found. Seed the database to continue.</p>;
  }

  const targets = await prisma.targetBand.findMany({
    where: { kpiId: kpi.id },
    orderBy: { period_key: 'asc' }
  });
  const actuals = await prisma.actual.findMany({
    where: { kpiId: kpi.id },
    orderBy: [{ period_key: 'asc' }, { brandId: 'asc' }]
  });

  const periods = Array.from(new Set(actuals.map((actual) => actual.period_key))).sort();

  const rows = periods.map((period) => ({
    periodKey: period,
    cells: brands.map((brand) => {
      const actual = actuals.find((a) => a.brandId === brand.id && a.period_key === period);
      const band = targets.find((t) => t.brandId === brand.id && t.period_key === period);
      const unitType = kpi.unit_type as '% | # | SAR | TEXT';
      return {
        kpiId: kpi.id,
        kpiCode: kpi.code,
        kpiNameAr: kpi.name_ar,
        kpiNameEn: kpi.name_en,
        brandId: brand.id,
        brandName: brand.name,
        brandColor: brand.color,
        periodKey: period,
        value: actual?.value ?? null,
        unitType,
        direction: kpi.direction,
        pctScale: (kpi.pct_scale === 1 ? 1 : 100) as 1 | 100,
        zeroIsEmpty: kpi.zero_is_empty,
        bands: band
          ? {
              level4: band.level4,
              level3: band.level3,
              level2: band.level2,
              level1: band.level1
            }
          : undefined
      };
    })
  }));

  const levelCounts = rows.reduce(
    (acc, row) => {
      row.cells.forEach((cell) => {
        if (!cell.bands || cell.value === null) return;
        const color = colorClass(cell.value, cell.bands, cell.direction, {
          treatZeroAsEmpty: cell.zeroIsEmpty
        });
        if (color !== 'none') {
          acc[color] += 1;
        }
      });
      return acc;
    },
    { 'level-1': 0, 'level-2': 0, 'level-3': 0, 'level-4': 0 }
  );

  const summary = summarizeLevels(levelCounts);

  const latestRow = rows[rows.length - 1];
  const totalActual = latestRow
    ? latestRow.cells.reduce((sum, cell) => sum + (cell.value ?? 0), 0)
    : 0;

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-slate-100">{kpi.name_en}</h1>
        <p className="mt-1 text-sm text-slate-300">{kpi.description}</p>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <KpiCard
          title={formatValue(totalActual, kpi.unit_type as '% | # | SAR | TEXT', { locale: 'en' })}
          subtitle="Total latest actuals"
          value={totalActual}
          unitType={kpi.unit_type as '% | # | SAR | TEXT'}
          direction={kpi.direction}
          bands={null}
        />
        <KpiCard
          title={`${Math.round(summary.score * 100)}%`}
          subtitle="Goal attainment"
          value={summary.score * 100}
          unitType="%"
          direction="HIGH"
          bands={{ level4: 100, level3: 75, level2: 50, level1: 0 }}
        />
        <KpiCard
          title={`${levelCounts['level-4']} green`}
          subtitle="# KPI periods on-track"
          value={levelCounts['level-4']}
          unitType="#"
          direction="HIGH"
          bands={{ level4: 16, level3: 12, level2: 8, level1: 0 }}
        />
      </section>
      <section className="space-y-4">
        <BrandLegend brands={brands} />
        <KpiHeatmap rows={rows} />
      </section>
    </div>
  );
}
