# AFCO KPI Control Tower

لوحة قيادة متكاملة لمؤشرات الأداء الرئيسية (KPIs) تدعم العربية والإنجليزية، مع إدارة للأهداف رباعية المستويات، واستيراد/تصدير Excel، وتكامل مع Office Scripts وPower Automate.

## المزايا الرئيسية

- **لوحة تحكم تفاعلية**: خريطة حرارة شهر × براند مع قواعد تلوين 4 مستويات منطق HIGH/LOW، وبطاقات KPI إجمالية.
- **إدارة التعاريف والأهداف**: CRUD لمؤشرات الأداء وتعريف الوحدات والاتجاهات ومستويات الهدف لكل براند/مدينة.
- **استيراد تلقائي**: رفع CSV/XLSX أو التكامل مع Power Automate لتحديث النتائج الفعلية وتشغيل سكربتات Office.
- **تصدير PDF/Excel**: تنزيل snapshot للوحة القيادة وتحضير تقرير PowerPoint مبدئي (script لتوليد القالب).
- **اختبارات وCI/CD**: Vitest للوحدات، Playwright للبنية، GitHub Actions للدمج المستمر.

## البدء السريع

```bash
pnpm install
cp .env.example .env
pnpm prisma migrate dev --name init
pnpm prisma db seed
pnpm dev
```

توجّه إلى `http://localhost:3000` وسجّل الدخول بأحد الحسابات:

- Admin: `admin@example.com` / `admin123`
- Analyst: `analyst@example.com` / `analyst123`
- Viewer: `viewer@example.com` / `viewer123`

## هيكل المشروع

```
/app
  /(dashboard)   # لوحة القيادة
  /(kpis)        # إدارة التعاريف
  /(targets)     # إدارة الأهداف
  /(actuals)     # شبكة القيم الفعلية
  /api           # REST (import/export/kpis/targets/actuals)
  /auth/sign-in  # تسجيل الدخول
/components      # المكونات (Heatmap, Cards, Legend)
/lib             # prisma, التلوين, الوحدات, csv/excel, auth
/prisma          # schema + seed
/scripts/office  # Office Scripts للتنسيق والتلوين
/tests           # Vitest + Playwright
```

## تدفقات البيانات

1. **استيراد**: `POST /api/import` يقبل ملف CSV/XLSX (حقول `kpi_code,brand_code,period_key,value,source`). يتم التحديث عبر `Actual.upsert` مع تسجيل في `AuditLog`.
2. **تحديث سريع**: صفحة `/actuals` تسمح بتعديل مباشر مع عرض حالة اللون حسب العتبات.
3. **الأهداف**: `/targets` لإدارة مستويات L1..L4 على مستوى عالمي أو براند/مدينة.
4. **التصدير**: `GET /api/export?format=xlsx|csv|pdf` يولد ملف Excel، CSV أو PDF بسيط.
5. **PowerPoint**: `pnpm ts-node --project tsconfig.scripts.json scripts/createPowerPoint.ts` يولد قالب عرض من 10 شرائح في `docs/powerpoint-template.pptx`.

## تكامل Excel

- `scripts/office/Fix_KPI_Formats.ts`: يطبّق Number Format حسب نوع الوحدة ويزيل التعبئة اليدوية.
- `scripts/office/Apply_4Bands.ts`: ينشئ قواعد Conditional Formatting لمستويات 4/3/2/1، ويهمل الأصفار والفارغ.
- استخدم Power Automate لاستدعاء `/api/import` بعد تنفيذ السكربتين.

## الاختبارات

- وحدات: `pnpm test`
- Playwright (يتطلب تشغيل الخادم): `pnpm exec playwright test`
- Lint: `pnpm lint`

## CI/CD

يتم تشغيل بناء Next.js، اختبار Vitest، وLint تلقائيًا عبر GitHub Actions (`.github/workflows/ci.yml`).

## تخصيص البيانات

حرّر `prisma/seed.ts` لإضافة براندات أو مدن إضافية ومستويات هدف جديدة. استخدم `pnpm prisma db seed` لإعادة ملء قاعدة البيانات التجريبية.

## النشر على GitHub Pages أو Vercel

- للبيئات الثابتة، استخدم `next export` بعد `pnpm build` ثم انشر مجلد `out/`.
- يُفضّل استضافة كاملة (Vercel/Netlify) لدعم API والاستيراد المباشر.
