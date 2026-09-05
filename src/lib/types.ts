import type { BrandProfile, CheckResult } from "./brand-check";
export type CheckRecord = {
  id: string;
  createdAt: string;
  excerpt: string;
  copyLength: number;
  result: CheckResult;
  copy?: string;
  brandId?: string;
  brandName?: string;
  profileSnapshot?: BrandProfile;
  profileRevision?: number;
};
export type { BrandProfile, CheckResult };
