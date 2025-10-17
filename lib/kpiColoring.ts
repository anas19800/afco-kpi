export type Direction = 'HIGH'|'LOW'
export type Bands = { level4:number; level3:number; level2:number; level1:number }

export function colorClass(value:number|string|null|undefined, bands:Bands|null|undefined, dir:Direction, treatZeroAsEmpty=true){
  if(value==null || bands==null) return 'none'

  const raw = typeof value === 'string' ? value.trim() : value
  if(raw === '') return 'none'

  const numeric = typeof raw === 'number' ? raw : Number(raw)
  if(!Number.isFinite(numeric)) return 'none'
  if(treatZeroAsEmpty && numeric === 0) return 'none'

  const v = numeric
  if(dir==='HIGH'){
    if(v >= bands.level4) return 'level-4'
    if(v >= bands.level3) return 'level-3'
    if(v >= bands.level2) return 'level-2'
    return 'level-1'
  } else {
    if(v <= bands.level4) return 'level-4'
    if(v <= bands.level3) return 'level-3'
    if(v <= bands.level2) return 'level-2'
    return 'level-1'
  }
}
