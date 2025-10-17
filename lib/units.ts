export function formatByUnitType(value:number|string|null|undefined, unit_type:string){
  if(value==null) return ''

  const raw = typeof value === 'string' ? value.trim() : value
  if(raw === '') return ''

  const numeric = typeof raw === 'number' ? raw : Number(raw)
  const hasNumericValue = typeof numeric === 'number' && Number.isFinite(numeric)
  const fallback = String(raw)

  switch(unit_type){
    case '%':
      return hasNumericValue ? `${numeric.toFixed(1)}%` : fallback
    case 'SAR':
      return hasNumericValue
        ? new Intl.NumberFormat('ar-SA', { style:'currency', currency:'SAR', maximumFractionDigits:0 }).format(numeric)
        : fallback
    case '#':
      return hasNumericValue ? new Intl.NumberFormat('en-US').format(numeric) : fallback
    case 'TEXT':
    default:
      return fallback
  }
}
