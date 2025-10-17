import { format } from 'date-fns';

export type UnitType = '%' | '#' | 'SAR' | 'TEXT';

type FormatOptions = {
  locale?: 'ar' | 'en';
  pctScale?: 1 | 100;
  digits?: number;
};

export function normalizePercentage(value: number, scale: 1 | 100) {
  if (scale === 1) {
    return value * 100;
  }
  return value;
}

export function formatValue(value: number | string | null | undefined, unit: UnitType, options: FormatOptions = {}) {
  if (value === null || value === undefined || value === '') {
    return '';
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return String(value);
  }
  const digits = options.digits ?? (unit === '%' ? 1 : unit === 'SAR' ? 2 : 1);
  const formatter = new Intl.NumberFormat(options.locale === 'ar' ? 'ar-SA' : 'en-US', {
    style: unit === 'SAR' ? 'currency' : 'decimal',
    currency: unit === 'SAR' ? 'SAR' : undefined,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  });
  if (unit === '%') {
    const scaled = normalizePercentage(numeric, options.pctScale ?? 100);
    return `${formatter.format(scaled)}%`;
  }
  if (unit === 'TEXT') {
    return String(value);
  }
  return formatter.format(numeric);
}

export function monthLabel(periodKey: string, locale: 'ar' | 'en' = 'en') {
  const date = new Date(`${periodKey}-01T00:00:00Z`);
  return format(date, locale === 'ar' ? 'MMM yyyy' : 'MMM yyyy');
}
