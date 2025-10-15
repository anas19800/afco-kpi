import './globals.css'
import { ReactNode } from 'react'

export const metadata = { title: 'AFCO KPI', description: 'KPI Platform' }

export default function RootLayout({ children }:{ children: ReactNode }){
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-slate-50 text-slate-900">{children}</body>
    </html>
  )
}
