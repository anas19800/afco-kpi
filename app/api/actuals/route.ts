import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { ActualSource, Role } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kpiId = searchParams.get('kpiId');
  const brandId = searchParams.get('brandId');
  const where = {
    ...(kpiId ? { kpiId } : {}),
    ...(brandId ? { brandId } : {})
  };
  const actuals = await prisma.actual.findMany({
    where,
    orderBy: [{ period_key: 'desc' }, { kpiId: 'asc' }]
  });
  return NextResponse.json(actuals);
}

export async function POST(request: Request) {
  const user = getSessionUser();
  if (!user || (user.role !== Role.Admin && user.role !== Role.Analyst)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json();
  const actual = await prisma.actual.upsert({
    where: {
      kpiId_brandId_cityId_period_key: {
        kpiId: body.kpiId,
        brandId: body.brandId,
        cityId: body.cityId ?? null,
        period_key: body.period_key
      }
    },
    create: {
      kpiId: body.kpiId,
      brandId: body.brandId,
      cityId: body.cityId ?? undefined,
      period_key: body.period_key,
      value: body.value,
      source: body.source as ActualSource,
      notes: body.notes
    },
    update: {
      value: body.value,
      source: body.source as ActualSource,
      notes: body.notes
    }
  });
  await prisma.auditLog.create({
    data: {
      entity: 'Actual',
      before: null,
      after: actual,
      by: user.email
    }
  });
  return NextResponse.json(actual, { status: 201 });
}
