import type { BrandProfile, CheckResult } from "./brand-check";

export type CheckRecord = {
  id: string;
  createdAt: string;
  excerpt: string;
  copyLength: number;
  result: CheckResult;
};

export type { BrandProfile, CheckResult };
