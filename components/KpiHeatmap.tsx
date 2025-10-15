'use client'
import { useMemo } from 'react'
import { colorClass } from '@/lib/kpiColoring'
import { formatByUnitType } from '@/lib/units'

type Cell = {
  period_key: string,
  brand_code: string,
  value: number|null,
  unit_type: string,
  direction: 'HIGH'|'LOW',
  bands: { level4:number; level3:number; level2:number; level1:number }
}

export default function KpiHeatmap({ data }:{ data: Cell[] }){
  const months = useMemo(()=>Array.from(new Set(data.map(d=>d.period_key))).sort(),[data])
  const brands = useMemo(()=>Array.from(new Set(data.map(d=>d.brand_code))).sort(),[data])
  const get = (m:string,b:string)=>data.find(d=>d.period_key===m && d.brand_code===b)

  return (
    <div className="overflow-auto border rounded-xl">
      <table className="min-w-[800px] w-full text-sm">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white z-10 p-2">Month \ Brand</th>
            {brands.map(b=> <th key={b} className="p-2 text-center">{b}</th>)}
          </tr>
        </thead>
        <tbody>
          {months.map(m=> (
            <tr key={m}>
              <td className="sticky left-0 bg-white z-10 p-2 font-medium">{m}</td>
              {brands.map(b=>{
                const cell = get(m,b)
                if(!cell) return <td key={b} className="p-2 text-center">-</td>
                const cls = colorClass(cell.value as any, cell.bands, cell.direction)
                return (
                  <td key={b} className={`p-2 text-center rounded ${
                    cls==='level-4'?'bg-green-600 text-white':
                    cls==='level-3'?'bg-green-300':
                    cls==='level-2'?'bg-orange-300':
                    cls==='level-1'?'bg-red-500 text-white':'bg-gray-100'
                  }`} title={`${b} ${m}: ${cell.value}`}>{ cell.value==null?'-':formatByUnitType(cell.value, cell.unit_type) }</td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
