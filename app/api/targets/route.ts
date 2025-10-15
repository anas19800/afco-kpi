import { prisma } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(){ const list = await prisma.targetBand.findMany({ include:{kpi:true,brand:true,city:true} }); return NextResponse.json(list) }
