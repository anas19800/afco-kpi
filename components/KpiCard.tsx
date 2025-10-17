import { colorClass } from '@/lib/kpiColoring';
import { formatValue, UnitType } from '@/lib/units';
import { Direction } from '@prisma/client';

export function KpiCard({
  title,
  subtitle,
  value,
  unitType,
  direction,
  bands
}: {
  title: string;
  subtitle?: string;
  value: number | null;
  unitType: UnitType;
  direction: Direction;
  bands?: {
    level4: number;
    level3: number;
    level2: number;
    level1: number;
  } | null;
}) {
  const color = bands ? colorClass(value, bands, direction) : 'none';
  const colorStyles: Record<string, string> = {
    'level-1': 'bg-kpi-level-1/20 border-kpi-level-1/60',
    'level-2': 'bg-kpi-level-2/20 border-kpi-level-2/60',
    'level-3': 'bg-kpi-level-3/20 border-kpi-level-3/60',
    'level-4': 'bg-kpi-level-4/20 border-kpi-level-4/60',
    none: 'bg-slate-900 border-slate-800'
  };

  return (
    <div className={`rounded-lg border px-4 py-3 transition ${colorStyles[color]}`}>
      <p className="text-xs uppercase tracking-wide text-slate-400">{subtitle}</p>
      <h3 className="mt-1 text-lg font-semibold text-slate-100">{title}</h3>
      <p className="mt-2 text-2xl font-bold text-slate-50">
        {value === null ? '—' : formatValue(value, unitType, { locale: 'en' })}
      </p>
    </div>
  );
}
