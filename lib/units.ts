export function formatByUnitType(value:number|string, unit_type:string){
  if(value==null || value==='') return ''
  const v = Number(value)
  switch(unit_type){
    case '%': return `${v.toFixed(1)}%`
    case 'SAR': return new Intl.NumberFormat('ar-SA', { style:'currency', currency:'SAR', maximumFractionDigits:0 }).format(v)
    case '#': return new Intl.NumberFormat('en-US').format(v)
    case 'TEXT': default: return String(value)
  }
}
