export function KpiCard({ title, value, hint, color }:{ title:string, value:string|number, hint?:string, color?:'green'|'red'|'orange'|'gray' }){
  const bg = color==='green'?'bg-green-600 text-white':color==='red'?'bg-red-600 text-white':color==='orange'?'bg-orange-500 text-white':'bg-gray-100'
  return (
    <div className={`rounded-2xl p-4 shadow ${bg}`}>
      <div className="text-xs opacity-80">{title}</div>
      <div className="text-2xl font-semibold">{value}</div>
      {hint && <div className="text-xs mt-1 opacity-80">{hint}</div>}
    </div>
  )
}
