import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const lcp = await prisma.brand.upsert({ where:{code:'LCP'}, create:{code:'LCP', name:'Kthabasa', color:'#0ea5e9'}, update:{} })
  await prisma.brand.upsert({ where:{code:'PSK'}, create:{code:'PSK', name:'Bushak', color:'#22c55e'}, update:{} })
  await prisma.brand.upsert({ where:{code:'OKA'}, create:{code:'OKA', name:'Okashi', color:'#a855f7'}, update:{} })
  await prisma.brand.upsert({ where:{code:'CND'}, create:{code:'CND', name:'Shake & Dip', color:'#ef4444'}, update:{} })
  const dammam = await prisma.city.upsert({ where:{name:'Dammam'}, create:{name:'Dammam', region:'Eastern'}, update:{} })
  const sales = await prisma.kpiDefinition.upsert({
    where:{code:'SALES_ACH'},
    create:{ code:'SALES_ACH', name_ar:'تحقق المبيعات', name_en:'Sales Achievement', unit_type:'%', direction:'HIGH', owner_dept:'Finance' },
    update:{},
  })
  const months = ['2025-07','2025-08','2025-09','2025-10','2025-11','2025-12']
  for (const m of months) {
    await prisma.targetBand.create({ data:{
      kpiId:sales.id, period_type:'Monthly', period_key:m, level4:90, level3:80, level2:70, level1:60
    }})
  }
  await prisma.actual.createMany({ data: months.map((m,i)=> ({
    kpiId:sales.id, brandId:lcp.id, cityId:dammam.id, period_key:m, value:75+i, source:'Manual'
  }))})
}
main().catch(e=>{console.error(e); process.exit(1)}).finally(()=>prisma.$disconnect())
