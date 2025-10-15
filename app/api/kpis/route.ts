import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(){ const list = await prisma.kpiDefinition.findMany({ orderBy:{code:'asc'} }); return NextResponse.json(list) }
