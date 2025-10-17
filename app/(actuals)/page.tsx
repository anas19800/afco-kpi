import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { ActualSource, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { formatValue } from '@/lib/units';
import { colorClass } from '@/lib/kpiColoring';

async function upsertActual(formData: FormData) {
  'use server';
  const user = requireRole([Role.Admin, Role.Analyst]);
  const kpiId = String(formData.get('kpiId'));
  const brandId = String(formData.get('brandId'));
  const cityIdValue = formData.get('cityId');
  const cityId = cityIdValue ? String(cityIdValue) : null;
  const period_key = String(formData.get('period_key'));
  const value = Number(formData.get('value'));
  const source = String(formData.get('source')) as ActualSource;
  const notes = String(formData.get('notes') ?? '');

  const actual = await prisma.actual.upsert({
    where: {
      kpiId_brandId_cityId_period_key: {
        kpiId,
        brandId,
        cityId,
        period_key
      }
    },
    create: {
      kpiId,
      brandId,
      cityId: cityId ?? undefined,
      period_key,
      value,
      source,
      notes
    },
    update: {
      value,
      source,
      notes
    }
  });

  await prisma.auditLog.create({
    data: {
      entity: 'Actual',
      before: null,
      after: actual,
      by: user.email
    }
  });

  revalidatePath('/actuals');
}

export default async function ActualsPage() {
  requireRole([Role.Admin, Role.Analyst, Role.Viewer]);
  const [kpis, brands, cities, actuals, targets] = await Promise.all([
    prisma.kpiDefinition.findMany({ orderBy: { name_en: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.city.findMany({ orderBy: { name: 'asc' } }),
    prisma.actual.findMany({ orderBy: [{ period_key: 'desc' }, { kpiId: 'asc' }] }),
    prisma.targetBand.findMany()
  ]);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-slate-100">Actuals</h1>
        <p className="text-sm text-slate-400">Inline grid to correct and append KPI actual values across brands and cities.</p>
      </section>
      <section className="overflow-hidden rounded-lg border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/40 text-left text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-2">Period</th>
              <th className="px-4 py-2">KPI</th>
              <th className="px-4 py-2">Brand</th>
              <th className="px-4 py-2">City</th>
              <th className="px-4 py-2">Value</th>
              <th className="px-4 py-2">Source</th>
              <th className="px-4 py-2">Color</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {actuals.slice(0, 120).map((actual) => {
              const kpi = kpis.find((item) => item.id === actual.kpiId);
              const brand = brands.find((item) => item.id === actual.brandId);
              const city = cities.find((item) => item.id === actual.cityId);
              const target = targets.find(
                (t) => t.kpiId === actual.kpiId && t.brandId === actual.brandId && t.period_key === actual.period_key
              );
              const color =
                kpi && target
                  ? colorClass(actual.value, target, kpi.direction, { treatZeroAsEmpty: kpi.zero_is_empty })
                  : 'none';
              return (
                <tr key={actual.id} className="hover:bg-slate-900/40">
                  <td className="px-4 py-2 text-slate-100">{actual.period_key}</td>
                  <td className="px-4 py-2 text-slate-100">{kpi?.name_en}</td>
                  <td className="px-4 py-2 text-slate-100">{brand?.name}</td>
                  <td className="px-4 py-2 text-slate-100">{city?.name ?? '—'}</td>
                  <td className="px-4 py-2 text-slate-100">{kpi ? formatValue(actual.value, kpi.unit_type as any) : actual.value}</td>
                  <td className="px-4 py-2 text-slate-300">{actual.source}</td>
                  <td className="px-4 py-2 text-slate-300">{color}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xl font-semibold text-slate-100">Quick add actual</h2>
        <form action={upsertActual} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-slate-300">KPI</span>
            <select name="kpiId" className="rounded border border-slate-700 bg-slate-950 px-3 py-2">
              {kpis.map((kpi) => (
                <option key={kpi.id} value={kpi.id}>
                  {kpi.name_en}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-slate-300">Brand</span>
            <select name="brandId" className="rounded border border-slate-700 bg-slate-950 px-3 py-2">
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-slate-300">City</span>
            <select name="cityId" className="rounded border border-slate-700 bg-slate-950 px-3 py-2">
              <option value="">All cities</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-slate-300">Period</span>
            <input
              name="period_key"
              placeholder="2024-07"
              required
              className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-slate-300">Value</span>
            <input name="value" type="number" step="0.01" required className="rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-slate-300">Source</span>
            <select name="source" className="rounded border border-slate-700 bg-slate-950 px-3 py-2">
              {Object.values(ActualSource).map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </label>
          <label className="md:col-span-2 flex flex-col gap-2 text-sm">
            <span className="text-slate-300">Notes</span>
            <textarea name="notes" rows={3} className="rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
            >
              Save actual
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
