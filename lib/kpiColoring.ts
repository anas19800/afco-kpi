export type Direction = 'HIGH'|'LOW'
export type Bands = { level4:number; level3:number; level2:number; level1:number }

export function colorClass(value:number|null|undefined, bands:Bands, dir:Direction, treatZeroAsEmpty=true){
  if(value==null || value===undefined || value==='' || (treatZeroAsEmpty && Number(value)===0)) return 'none'
  const v = Number(value)
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
