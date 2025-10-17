'use client';

import { useLocale } from './providers/LocaleProvider';
import { Locale } from '@/lib/messages';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const toggle = () => setLocale(locale === 'ar' ? 'en' : 'ar');
  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1 text-sm hover:bg-slate-800"
    >
      {locale === 'ar' ? 'English' : 'العربية'}
    </button>
  );
}

export function LanguageBadge({ value }: { value: Locale }) {
  return (
    <span className="rounded bg-slate-800 px-2 py-1 text-xs uppercase text-slate-300">{value}</span>
  );
}
