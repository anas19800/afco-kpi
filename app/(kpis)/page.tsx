import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/auth';
import { Direction, Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';

async function createKpi(formData: FormData) {
  'use server';
  requireRole([Role.Admin]);
  const data = {
    code: String(formData.get('code')),
    name_en: String(formData.get('name_en')),
    name_ar: String(formData.get('name_ar')),
    unit_type: String(formData.get('unit_type')),
    direction: String(formData.get('direction')) as Direction,
    description: String(formData.get('description') ?? ''),
    owner_dept: String(formData.get('owner_dept') ?? ''),
    pct_scale: Number(formData.get('pct_scale') ?? 100),
    zero_is_empty: formData.get('zero_is_empty') === 'on'
  };
  await prisma.kpiDefinition.create({ data });
  await prisma.auditLog.create({
    data: {
      entity: 'KpiDefinition',
      before: null,
      after: data,
      by: 'system'
    }
  });
  revalidatePath('/kpis');
}

export default async function KpisPage() {
  requireRole([Role.Admin, Role.Analyst]);
  const kpis = await prisma.kpiDefinition.findMany({ orderBy: { code: 'asc' } });
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-semibold text-slate-100">KPI definitions</h1>
        <p className="text-sm text-slate-400">
          Configure the KPIs, their units, directions and default percentage scaling.
        </p>
      </section>
      <section className="overflow-hidden rounded-lg border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/40 text-left text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-2">Code</th>
              <th className="px-4 py-2">Name (EN)</th>
              <th className="px-4 py-2">Name (AR)</th>
              <th className="px-4 py-2">Unit</th>
              <th className="px-4 py-2">Direction</th>
              <th className="px-4 py-2">Owner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {kpis.map((kpi) => (
              <tr key={kpi.id} className="hover:bg-slate-900/40">
                <td className="px-4 py-2 font-mono text-xs text-slate-300">{kpi.code}</td>
                <td className="px-4 py-2 text-slate-100">{kpi.name_en}</td>
                <td className="px-4 py-2 text-slate-100">{kpi.name_ar}</td>
                <td className="px-4 py-2 text-slate-300">{kpi.unit_type}</td>
                <td className="px-4 py-2 text-slate-300">{kpi.direction}</td>
                <td className="px-4 py-2 text-slate-300">{kpi.owner_dept}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-6">
        <h2 className="text-xl font-semibold text-slate-100">Add KPI</h2>
        <form action={createKpi} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-slate-300">Code</span>
            <input name="code" required className="rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-slate-300">Name (English)</span>
            <input name="name_en" required className="rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-slate-300">Name (Arabic)</span>
            <input name="name_ar" required className="rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-slate-300">Unit</span>
            <select name="unit_type" className="rounded border border-slate-700 bg-slate-950 px-3 py-2">
              <option value="%">%</option>
              <option value="#">#</option>
              <option value="SAR">SAR</option>
              <option value="TEXT">TEXT</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-slate-300">Direction</span>
            <select name="direction" className="rounded border border-slate-700 bg-slate-950 px-3 py-2">
              <option value="HIGH">HIGH</option>
              <option value="LOW">LOW</option>
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-slate-300">Owner department</span>
            <input name="owner_dept" className="rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-slate-300">Percent scale</span>
            <select name="pct_scale" className="rounded border border-slate-700 bg-slate-950 px-3 py-2">
              <option value="100">0-100</option>
              <option value="1">0-1</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input type="checkbox" name="zero_is_empty" defaultChecked className="rounded border-slate-700" />
            Treat zero as empty
          </label>
          <label className="md:col-span-2 flex flex-col gap-2 text-sm">
            <span className="text-slate-300">Description</span>
            <textarea name="description" rows={3} className="rounded border border-slate-700 bg-slate-950 px-3 py-2" />
          </label>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="rounded bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
            >
              Save KPI
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
