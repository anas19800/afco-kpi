'use client';

import { HeatmapRow } from '@/lib/types';
import { colorClass } from '@/lib/kpiColoring';
import { formatValue } from '@/lib/units';
import { useLocale } from './providers/LocaleProvider';

export function KpiHeatmap({ rows }: { rows: HeatmapRow[] }) {
  const { locale } = useLocale();
  const brands = rows[0]?.cells.map((cell) => ({ id: cell.brandId, name: cell.brandName })) ?? [];
  return (
    <div className="overflow-x-auto">
      <table className={`table-auto min-w-full divide-y divide-slate-800 ${locale === 'ar' ? 'lang-ar' : ''}`}>
        <thead>
          <tr>
            <th className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              {locale === 'ar' ? 'الشهر' : 'Month'}
            </th>
            {brands.map((brand) => (
              <th key={brand.id} className="text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                {brand.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {rows.map((row) => (
            <tr key={row.periodKey} className="align-top">
              <td className="whitespace-nowrap text-sm font-medium text-slate-200">{row.periodKey}</td>
              {row.cells.map((cell) => {
                const color = cell.bands
                  ? colorClass(cell.value, cell.bands, cell.direction, {
                      treatZeroAsEmpty: cell.zeroIsEmpty
                    })
                  : 'none';
                const colorStyles: Record<string, string> = {
                  'level-1': 'bg-kpi-level-1/30 border-kpi-level-1/60',
                  'level-2': 'bg-kpi-level-2/30 border-kpi-level-2/60',
                  'level-3': 'bg-kpi-level-3/30 border-kpi-level-3/60',
                  'level-4': 'bg-kpi-level-4/30 border-kpi-level-4/60',
                  none: 'bg-slate-900/60 border-slate-800'
                };
                return (
                  <td key={cell.brandId} className={`border text-sm text-slate-100 ${colorStyles[color]}`}>
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold">{formatValue(cell.value, cell.unitType, { locale })}</span>
                      {cell.bands && (
                        <span className="text-xs text-slate-300">
                          L4 {cell.bands.level4.toFixed(1)} / L3 {cell.bands.level3.toFixed(1)} / L2{' '}
                          {cell.bands.level2.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
