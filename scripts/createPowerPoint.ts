import PptxGenJS from 'pptxgenjs';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export async function generatePowerPoint(outputPath = 'docs/powerpoint-template.pptx') {
  const pptx = new PptxGenJS();
  const slides = [
    { title: 'AFCO KPI Control Tower', bullets: ['Executive Summary', 'Brands: AFCO, LCP, PSK, OKA', 'Period: FY2024'] },
    { title: 'Portfolio Overview', bullets: ['Regional footprint', 'Brand positioning', 'Key highlights'] },
    { title: 'KPI Heatmap', bullets: ['4-band colour legend', 'Monthly vs Brand', 'Top-performing segments'] },
    { title: 'Revenue Performance', bullets: ['MTD Revenue vs Target', 'AAGR trend', 'Variance analysis'] },
    { title: 'Net Promoter Score', bullets: ['Direction HIGH', 'Customer sentiment drivers', 'Action items'] },
    { title: 'Delivery Time', bullets: ['Direction LOW', 'Operational bottlenecks', 'Process improvements'] },
    { title: 'Targets Deep Dive', bullets: ['Brand-specific levels L4-L1', 'City overlays', 'Upcoming revisions'] },
    { title: 'Actuals Quality', bullets: ['Source mix (Manual/PowerQuery/API)', 'Data validation alerts', 'Audit log snapshot'] },
    { title: 'Automation Roadmap', bullets: ['Power Automate flows', 'Office Scripts integration', 'Database checkpoints'] },
    { title: 'Recommendations', bullets: ['Focus KPIs for next quarter', 'Key risks & mitigations', 'Owner departments'] }
  ];

  slides.forEach((slide) => {
    const slideInstance = pptx.addSlide();
    slideInstance.addText(slide.title, {
      x: 0.5,
      y: 0.5,
      fontSize: 28,
      bold: true,
      color: '003366'
    });
    slideInstance.addText(slide.bullets, {
      x: 0.7,
      y: 1.5,
      fontSize: 18,
      color: '111111',
      bullet: true,
      lineSpacing: 30
    });
  });

  const buffer = await pptx.write('nodebuffer');
  const dir = path.dirname(outputPath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(outputPath, buffer);
  return outputPath;
}

const isCli = (() => {
  const current = fileURLToPath(import.meta.url);
  const executed = process.argv[1] ? path.resolve(process.argv[1]) : undefined;
  return executed === current;
})();

if (isCli) {
  generatePowerPoint().then((file) => {
    console.log(`PowerPoint template written to ${file}`);
  });
}
