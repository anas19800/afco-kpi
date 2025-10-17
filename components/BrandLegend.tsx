import { Brand } from '@prisma/client';

export function BrandLegend({ brands }: { brands: Pick<Brand, 'id' | 'name' | 'color'>[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {brands.map((brand) => (
        <div key={brand.id} className="flex items-center gap-2 text-sm text-slate-200">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: brand.color }} />
          <span>{brand.name}</span>
        </div>
      ))}
    </div>
  );
}
