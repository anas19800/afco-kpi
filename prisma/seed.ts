import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const lcp = await prisma.brand.upsert({
    where: { code: 'LCP' },
    create: { code: 'LCP', name: 'Kthabasa', color: '#0ea5e9' },
    update: {},
  })

  await prisma.brand.upsert({
    where: { code: 'PSK' },
    create: { code: 'PSK', name: 'Bushak', color: '#22c55e' },
    update: {},
  })

  await prisma.brand.upsert({
    where: { code: 'OKA' },
    create: { code: 'OKA', name: 'Okashi', color: '#a855f7' },
    update: {},
  })

  await prisma.brand.upsert({
    where: { code: 'CND' },
    create: { code: 'CND', name: 'Shake & Dip', color: '#ef4444' },
    update: {},
  })

  const dammam = await prisma.city.upsert({
    where: { name: 'Dammam' },
    create: { name: 'Dammam', region: 'Eastern' },
    update: {},
  })

  const sales = await prisma.kpiDefinition.upsert({
    where: { code: 'SALES_ACH' },
    create: {
      code: 'SALES_ACH',
      name_ar: 'تحقق المبيعات',
      name_en: 'Sales Achievement',
      unit_type: '%',
      direction: 'HIGH',
      owner_dept: 'Finance',
    },
    update: {},
  })

  const months = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12']

  for (const period_key of months) {
    await prisma.targetBand.upsert({
      where: {
        kpiId_period_type_period_key: {
          kpiId: sales.id,
          period_type: 'Monthly',
          period_key,
        },
      },
      update: {},
      create: {
        kpiId: sales.id,
        period_type: 'Monthly',
        period_key,
        level4: 90,
        level3: 80,
        level2: 70,
        level1: 60,
      },
    })
  }

  await prisma.actual.createMany({
    data: months.map((period_key, index) => ({
      kpiId: sales.id,
      brandId: lcp.id,
      cityId: dammam.id,
      period_key,
      value: 75 + index,
      source: 'Manual',
    })),
    skipDuplicates: true,
  })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
