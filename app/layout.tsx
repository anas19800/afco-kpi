import './globals.css';
import { ReactNode } from 'react';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { getSessionUser } from '@/lib/auth';
import Link from 'next/link';

export const metadata = {
  title: 'AFCO KPI Control Tower',
  description: 'Balanced KPI control tower for AFCO brands with automated imports and Office integrations.'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const session = getSessionUser();
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">
        <LocaleProvider>
          <header className="border-b border-slate-800 bg-slate-900/80">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <div className="flex items-center gap-6">
                <Link href="/" className="text-lg font-semibold text-slate-100">
                  KPI Tower
                </Link>
                <nav className="flex gap-4 text-sm text-slate-300">
                  <Link href="/" className="hover:text-slate-100">
                    Dashboard
                  </Link>
                  <Link href="/kpis" className="hover:text-slate-100">
                    KPIs
                  </Link>
                  <Link href="/targets" className="hover:text-slate-100">
                    Targets
                  </Link>
                  <Link href="/actuals" className="hover:text-slate-100">
                    Actuals
                  </Link>
                </nav>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-300">
                {session ? <span>{session.name}</span> : <Link href="/auth/sign-in">Sign in</Link>}
                <LanguageSwitcher />
              </div>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        </LocaleProvider>
      </body>
    </html>
  );
}
