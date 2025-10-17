import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { toCsv } from '@/lib/csv';
import { buildWorkbook } from '@/lib/excel';
import { getSessionUser } from '@/lib/auth';
import PDFDocument from 'pdfkit';

async function buildPdf(rows: Record<string, unknown>[]) {
  const doc = new PDFDocument({ margin: 32, size: 'A4' });
  const buffers: Buffer[] = [];
  doc.on('data', (chunk) => buffers.push(chunk as Buffer));
  const header = 'AFCO KPI Dashboard Export';
  doc.fontSize(18).text(header, { align: 'center' });
  doc.moveDown();
  doc.fontSize(10);
  rows.forEach((row) => {
    doc.text(`${row.period_key} - ${row.kpi_code} - ${row.brand_code} - ${row.value}`);
  });
  doc.end();
  await new Promise((resolve) => doc.on('end', resolve));
  return Buffer.concat(buffers);
}

export async function GET(request: Request) {
  const user = getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const url = new URL(request.url);
  const format = url.searchParams.get('format') ?? 'xlsx';

  const rows = await prisma.actual.findMany({
    include: {
      kpi: true,
      brand: true
    },
    orderBy: [{ period_key: 'asc' }, { kpiId: 'asc' }]
  });

  const payload = rows.map((row) => ({
    period_key: row.period_key,
    kpi_code: row.kpi.code,
    kpi_name_en: row.kpi.name_en,
    brand_code: row.brand.code,
    value: row.value,
    source: row.source
  }));

  if (format === 'csv') {
    const csv = toCsv(payload);
    return new NextResponse(csv, {
      headers: {
        'content-type': 'text/csv',
        'content-disposition': 'attachment; filename="kpis.csv"'
      }
    });
  }

  if (format === 'pdf') {
    const pdf = await buildPdf(payload);
    return new NextResponse(pdf, {
      headers: {
        'content-type': 'application/pdf',
        'content-disposition': 'attachment; filename="kpis.pdf"'
      }
    });
  }

  const workbook = buildWorkbook(payload);
  return new NextResponse(workbook, {
    headers: {
      'content-type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'content-disposition': 'attachment; filename="kpis.xlsx"'
    }
  });
}
