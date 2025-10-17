import { read, utils, write } from 'xlsx';

export function parseWorkbook(buffer: ArrayBuffer | Buffer) {
  const workbook = read(buffer, { type: Buffer.isBuffer(buffer) ? 'buffer' : 'array' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return utils.sheet_to_json<Record<string, string>>(sheet, { defval: '' });
}

export function buildWorkbook(rows: Record<string, unknown>[], sheetName = 'KPIs') {
  const worksheet = utils.json_to_sheet(rows);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, sheetName);
  return write(workbook, { type: 'buffer', bookType: 'xlsx' });
}
