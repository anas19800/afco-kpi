import { PrismaClient, ActualSource, Direction, PeriodType, Role } from '@prisma/client';

const prisma = new PrismaClient();

const months2024 = [
  '2024-01',
  '2024-02',
  '2024-03',
  '2024-04',
  '2024-05',
  '2024-06',
  '2024-07',
  '2024-08',
  '2024-09',
  '2024-10',
  '2024-11',
  '2024-12'
];

async function main() {
  await prisma.auditLog.deleteMany();
  await prisma.actual.deleteMany();
  await prisma.targetBand.deleteMany();
  await prisma.kpiDefinition.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.city.deleteMany();
  await prisma.unitMap.deleteMany();
  await prisma.user.deleteMany();

  const [afco, lcp, psk, oka] = await Promise.all([
    prisma.brand.create({ data: { code: 'AFCO', name: 'AFCO', color: '#0f766e' } }),
    prisma.brand.create({ data: { code: 'LCP', name: 'LCP', color: '#7c3aed' } }),
    prisma.brand.create({ data: { code: 'PSK', name: 'PSK', color: '#ea580c' } }),
    prisma.brand.create({ data: { code: 'OKA', name: 'OKA', color: '#2563eb' } })
  ]);

  const [riyadh, jeddah, dammam] = await Promise.all([
    prisma.city.create({ data: { name: 'Riyadh', region: 'Central' } }),
    prisma.city.create({ data: { name: 'Jeddah', region: 'West' } }),
    prisma.city.create({ data: { name: 'Dammam', region: 'East' } })
  ]);

  const revenue = await prisma.kpiDefinition.create({
    data: {
      code: 'REV_MTD',
      name_ar: 'الإيرادات - شهر حتى تاريخه',
      name_en: 'Revenue MTD',
      unit_type: 'SAR',
      direction: Direction.HIGH,
      description: 'Monthly revenue collected by brand.',
      owner_dept: 'Finance',
      pct_scale: 100,
      zero_is_empty: false
    }
  });

  const nps = await prisma.kpiDefinition.create({
    data: {
      code: 'NPS',
      name_ar: 'صافي نقاط الترويج',
      name_en: 'Net Promoter Score',
      unit_type: '%',
      direction: Direction.HIGH,
      description: 'Customer satisfaction rating.',
      owner_dept: 'Customer Success',
      pct_scale: 100,
      zero_is_empty: false
    }
  });

  const deliveryTime = await prisma.kpiDefinition.create({
    data: {
      code: 'DLV_TIME',
      name_ar: 'وقت التوصيل',
      name_en: 'Delivery Time',
      unit_type: '#',
      direction: Direction.LOW,
      description: 'Average delivery time in hours.',
      owner_dept: 'Operations',
      pct_scale: 100,
      zero_is_empty: false
    }
  });

  await prisma.unitMap.createMany({
    data: [
      { code: '%', numberFormat: '0.0%' },
      { code: '#', numberFormat: '#,##0.0' },
      { code: 'SAR', numberFormat: '[$-ar-SA]#,##0.00 [$SAR-1025]' },
      { code: 'TEXT', numberFormat: '@' }
    ]
  });

  const allBrands = [afco, lcp, psk, oka];
  const allCities = [riyadh, jeddah, dammam];

  for (const kpi of [revenue, nps, deliveryTime]) {
    for (const brand of allBrands) {
      await prisma.targetBand.createMany({
        data: months2024.map((period) => {
          const base = kpi.code === 'REV_MTD' ? 1000000 : kpi.code === 'NPS' ? 70 : 4;
          const variance = Math.random() * (kpi.code === 'REV_MTD' ? 250000 : kpi.code === 'NPS' ? 10 : 1);
          const level4 = kpi.direction === Direction.HIGH ? base + variance : base - variance;
          const level3 = kpi.direction === Direction.HIGH ? level4 - base * 0.05 : level4 + 0.5;
          const level2 = kpi.direction === Direction.HIGH ? level3 - base * 0.05 : level3 + 0.5;
          const level1 = kpi.direction === Direction.HIGH ? level2 - base * 0.05 : level2 + 0.5;
          return {
            kpiId: kpi.id,
            brandId: brand.id,
            period_type: PeriodType.Monthly,
            period_key: period,
            level4,
            level3,
            level2,
            level1
          };
        })
      });
    }
  }

  for (const kpi of [revenue, nps, deliveryTime]) {
    for (const brand of allBrands) {
      for (const city of allCities) {
        await prisma.actual.createMany({
          data: months2024.map((period) => {
            const base = kpi.code === 'REV_MTD' ? 950000 : kpi.code === 'NPS' ? 60 : 5;
            const noise = Math.random() * (kpi.code === 'REV_MTD' ? 300000 : kpi.code === 'NPS' ? 20 : 2) - 50;
            const value = kpi.direction === Direction.HIGH ? base + noise : base - noise;
            return {
              kpiId: kpi.id,
              brandId: brand.id,
              cityId: city.id,
              period_key: period,
              value,
              source: ActualSource.PowerQuery
            };
          })
        });
      }
    }
  }

  await prisma.user.createMany({
    data: [
      { name: 'Admin User', email: 'admin@example.com', role: Role.Admin, password: 'admin123' },
      { name: 'Analyst User', email: 'analyst@example.com', role: Role.Analyst, password: 'analyst123' },
      { name: 'Viewer User', email: 'viewer@example.com', role: Role.Viewer, password: 'viewer123' }
    ]
  });

  console.log('Database seeded with demo data.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
