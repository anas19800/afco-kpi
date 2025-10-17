import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { PeriodType, Role } from '@prisma/client';

export async function GET() {
  const targets = await prisma.targetBand.findMany();
  return NextResponse.json(targets);
}

export async function POST(request: Request) {
  const user = getSessionUser();
  if (!user || (user.role !== Role.Admin && user.role !== Role.Analyst)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json();
  const target = await prisma.targetBand.upsert({
    where: {
      kpiId_brandId_cityId_period_key: {
        kpiId: body.kpiId,
        brandId: body.brandId ?? null,
        cityId: body.cityId ?? null,
        period_key: body.period_key
      }
    },
    create: {
      kpiId: body.kpiId,
      brandId: body.brandId ?? undefined,
      cityId: body.cityId ?? undefined,
      period_key: body.period_key,
      period_type: body.period_type as PeriodType,
      level4: body.level4,
      level3: body.level3,
      level2: body.level2,
      level1: body.level1
    },
    update: {
      period_type: body.period_type as PeriodType,
      level4: body.level4,
      level3: body.level3,
      level2: body.level2,
      level1: body.level1
    }
  });
  await prisma.auditLog.create({
    data: {
      entity: 'TargetBand',
      before: null,
      after: target,
      by: user.email
    }
  });
  return NextResponse.json(target, { status: 201 });
}
