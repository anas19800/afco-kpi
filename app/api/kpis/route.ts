import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';
import { Direction, Role } from '@prisma/client';

export async function GET() {
  const kpis = await prisma.kpiDefinition.findMany({ orderBy: { code: 'asc' } });
  return NextResponse.json(kpis);
}

export async function POST(request: Request) {
  const user = getSessionUser();
  if (!user || user.role !== Role.Admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const body = await request.json();
  const kpi = await prisma.kpiDefinition.create({
    data: {
      code: body.code,
      name_en: body.name_en,
      name_ar: body.name_ar,
      unit_type: body.unit_type,
      direction: body.direction as Direction,
      description: body.description,
      owner_dept: body.owner_dept,
      pct_scale: body.pct_scale ?? 100,
      zero_is_empty: body.zero_is_empty ?? true
    }
  });
  return NextResponse.json(kpi, { status: 201 });
}
