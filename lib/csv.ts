import Papa from 'papaparse';

export function parseCsv(content: string) {
  const result = Papa.parse(content, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim()
  });
  if (result.errors.length) {
    throw new Error(result.errors.map((err) => err.message).join('; '));
  }
  return result.data as Record<string, string>[];
}

export function toCsv(rows: Record<string, unknown>[]) {
  return Papa.unparse(rows);
}
