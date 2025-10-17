import { Direction, PeriodType, Role } from '@prisma/client';
import { UnitType } from './units';

export type HeatmapCell = {
  kpiId: string;
  kpiCode: string;
  kpiNameAr: string;
  kpiNameEn: string;
  brandId: string;
  brandName: string;
  brandColor: string;
  periodKey: string;
  value: number | null;
  unitType: UnitType;
  direction: Direction;
  pctScale: 1 | 100;
  zeroIsEmpty: boolean;
  bands?: {
    level4: number;
    level3: number;
    level2: number;
    level1: number;
  };
};

export type HeatmapRow = {
  periodKey: string;
  cells: HeatmapCell[];
};

export type DashboardFilters = {
  brandIds?: string[];
  cityIds?: string[];
  periodFrom?: string;
  periodTo?: string;
  unit?: UnitType;
  direction?: Direction;
};

export type UserSession = {
  id: string;
  email: string;
  role: Role;
  name: string;
};
