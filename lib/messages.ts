export type Locale = 'ar' | 'en';

type Messages = Record<string, string>;

const en: Messages = {
  dashboard: 'Dashboard',
  kpis: 'KPI Definitions',
  targets: 'Targets',
  actuals: 'Actuals',
  logout: 'Sign out',
  language: 'Language',
  brands: 'Brands',
  cities: 'Cities',
  period: 'Period',
  unit: 'Unit',
  direction: 'Direction',
  upload: 'Upload',
  download: 'Download Export',
  scorecard: 'Scorecard',
  totals: 'Totals',
  level1: 'Level 1',
  level2: 'Level 2',
  level3: 'Level 3',
  level4: 'Level 4',
  percentageAchieved: 'Goal Achievement',
  addActual: 'Add Actual',
  editTarget: 'Edit Target',
  addKpi: 'Add KPI',
  welcome: 'KPI Control Tower',
  filters: 'Filters',
  month: 'Month',
  brand: 'Brand',
  city: 'City',
  value: 'Value',
  source: 'Source',
  notes: 'Notes',
  submit: 'Submit',
  cancel: 'Cancel'
};

const ar: Messages = {
  dashboard: 'لوحة القيادة',
  kpis: 'تعريفات المؤشرات',
  targets: 'الأهداف',
  actuals: 'النتائج الفعلية',
  logout: 'تسجيل الخروج',
  language: 'اللغة',
  brands: 'البراندات',
  cities: 'المدن',
  period: 'الفترة',
  unit: 'الوحدة',
  direction: 'الاتجاه',
  upload: 'رفع',
  download: 'تحميل التقرير',
  scorecard: 'بطاقات الأداء',
  totals: 'الإجماليات',
  level1: 'المستوى 1',
  level2: 'المستوى 2',
  level3: 'المستوى 3',
  level4: 'المستوى 4',
  percentageAchieved: 'نسبة تحقيق الهدف',
  addActual: 'إضافة نتيجة',
  editTarget: 'تعديل الهدف',
  addKpi: 'إضافة مؤشر',
  welcome: 'برج التحكم للمؤشرات',
  filters: 'الفلاتر',
  month: 'الشهر',
  brand: 'البراند',
  city: 'المدينة',
  value: 'القيمة',
  source: 'المصدر',
  notes: 'ملاحظات',
  submit: 'حفظ',
  cancel: 'إلغاء'
};

export const messages: Record<Locale, Messages> = { ar, en };

export function t(locale: Locale, key: keyof typeof en) {
  return (messages[locale] ?? en)[key] ?? key;
}
