import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { PeriodType, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';

async function upsertTarget(formData: FormData) {
  'use server';
  const user = requireRole([Role.Admin, Role.Analyst]);
  const kpiId = String(formData.get('kpiId'));
  const brandIdValue = formData.get('brandId');
  const cityIdValue = formData.get('cityId');
  const brandId = brandIdValue ? String(brandIdValue) : null;
  const cityId = cityIdValue ? String(cityIdValue) : null;
  const period_key = String(formData.get('period_key'));
  const period_type = String(formData.get('period_type')) as PeriodType;
  const levels = {
    level4: Number(formData.get('level4') ?? 0),
    level3: Number(formData.get('level3') ?? 0),
    level2: Number(formData.get('level2') ?? 0),
    level1: Number(formData.get('level1') ?? 0)
  };

  const target = await prisma.targetBand.upsert({
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
      brandId: brandId ?? undefined,
      cityId: cityId ?? undefined,
      period_key,
      period_type,
      ...levels
    },
    update: {
      period_type,
      ...levels
    }
  });

  await prisma.auditLog.create({
    data: {
      entity: 'TargetBand',
      before: null,
      after: target,
      by: user.email
    }
  });

  revalidatePath('/targets');
}

export default async function TargetsPage() {
  requireRole([Role.Admin, Role.Analyst, Role.Viewer]);
  const [kpis, brands, cities, targets] = await Promise.all([
    prisma.kpiDefinition.findMany({ orderBy: { name_en: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.city.findMany({ orderBy: { name: 'asc' } }),
    prisma.targetBand.findMany({ orderBy: [{ period_key: 'desc' }, { kpiId: 'asc' }] })
  ]);

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-semibold text-slate-100">Target bands</h1>
        <p className="text-sm text-slate-400">Maintain the four-band thresholds for each KPI, brand and city.</p>
      </section>
      <section className="overflow-hidden rounded-lg border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/40 text-left text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-2">Period</th>
              <th className="px-4 py-2">KPI</th>
              <th className="px-4 py-2">Brand</th>
              <th className="px-4 py-2">L4</th>
              <th className="px-4 py-2">L3</th>
              <th className="px-4 py-2">L2</th>
              <th className="px-4 py-2">L1</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {targets.slice(0, 100).map((target) => {
              const kpi = kpis.find((item) => item.id === target.kpiId);
              const brand = brands.find((item) => item.id === target.brandId);
              return (
                <tr key={target.id} className="hover:bg-slate-900/40">
                  <td className="px-4 py-2 text-slate-100">{target.period_key}</td>
                  <td className="px-4 py-2 text-slate-100">{kpi?.name_en}</td>
                  <td className="px-4 py-2 text-slate-100">{brand?.name ?? 'Global'}</td>
                  <td className="px-4 py-2 text-slate-300">{target.level4.toFixed(2)}</td>
                  <td className="px-4 py-2 text-slate-300">{target.level3.toFixed(2)}</td>
                  <td className="px-4 py-2 text-slate-300">{target.level2.toFixed(2)}</td>
                  <td className="px-4 py-2 text-slate-300">{target.level1.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xl font-semibold text-slate-100">Update or create target</h2>
        <form action={upsertTarget} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <option value="">Global</option>
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
            <span className="text-slate-300">Period key</span>
            <input
              name="period_key"
              placeholder="2024-07"
              required
              className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-slate-300">Period type</span>
            <select name="period_type" className="rounded border border-slate-700 bg-slate-950 px-3 py-2">
              <option value="Monthly">Monthly</option>
              <option value="Quarterly">Quarterly</option>
              <option value="Yearly">Yearly</option>
            </select>
          </label>
          {['level4', 'level3', 'level2', 'level1'].map((level) => (
            <label key={level} className="flex flex-col gap-2 text-sm">
              <span className="text-slate-300">{level.toUpperCase()}</span>
              <input
                name={level}
                type="number"
                step="0.01"
                required
                className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
              />
            </label>
          ))}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
            >
              Save target
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
