import { NextResponse, NextRequest } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { Role } from '@prisma/client';
import { parseCsv } from '@/lib/csv';
import { parseWorkbook } from '@/lib/excel';
import { prisma } from '@/lib/prisma';
import { ActualSource } from '@prisma/client';

export async function POST(request: NextRequest) {
  const user = getSessionUser();
  if (!user || (user.role !== Role.Admin && user.role !== Role.Analyst)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const formData = await request.formData();
  const file = formData.get('file');
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'File is required' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const rows =
    file.type === 'text/csv' || file.name.endsWith('.csv')
      ? parseCsv(buffer.toString('utf-8'))
      : parseWorkbook(buffer);

  const results: { status: 'ok' | 'error'; message: string }[] = [];

  for (const row of rows) {
    try {
      const kpi = await prisma.kpiDefinition.findUnique({ where: { code: row.kpi_code } });
      const brand = await prisma.brand.findUnique({ where: { code: row.brand_code } });
      if (!kpi || !brand) {
        throw new Error('Unknown KPI or brand code');
      }
      await prisma.actual.upsert({
        where: {
          kpiId_brandId_cityId_period_key: {
            kpiId: kpi.id,
            brandId: brand.id,
            cityId: null,
            period_key: row.period_key
          }
        },
        create: {
          kpiId: kpi.id,
          brandId: brand.id,
          cityId: null,
          period_key: row.period_key,
          value: Number(row.value),
          source: (row.source as ActualSource) ?? ActualSource.Manual,
          notes: row.notes ?? null
        },
        update: {
          value: Number(row.value),
          source: (row.source as ActualSource) ?? ActualSource.Manual,
          notes: row.notes ?? null
        }
      });
      results.push({ status: 'ok', message: `${row.kpi_code} ${row.period_key}` });
    } catch (error) {
      results.push({ status: 'error', message: error instanceof Error ? error.message : String(error) });
    }
  }

  await prisma.auditLog.create({
    data: {
      entity: 'Import',
      before: null,
      after: { rows: results },
      by: user.email
    }
  });

  return NextResponse.json({ results });
}
