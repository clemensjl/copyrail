import { randomUUID } from "node:crypto";
import { ApiError } from "./api";
import { database, ensureDatabase } from "./db";
import type { BrandProfile } from "./brand-check";
export type Brand = { id: string; name: string; revision: number; isDefault: boolean; createdAt: string };
export type BrandWithProfile = Brand & { profile: BrandProfile };
const starterProfile: BrandProfile = { mustUse: ["Copyrail", "brand voice"], mustAvoid: ["synergy", "world-class"], bannedClaims: ["guaranteed results", "#1 in the world"] };
function fromRow(row: Record<string, unknown>): BrandWithProfile {
  return {id: String(row.id), name: String(row.name), revision: Number(row.revision), isDefault: Number(row.slot) === 0, createdAt: new Date(String(row.created_at)).toISOString(), profile: row.profile as BrandProfile};
}
export async function ensureDefaultBrand(userId: string) {
  await ensureDatabase();
  await database()`INSERT INTO copyrail_brands (id, user_id, slot, name, profile)
    SELECT ${userId + "_default"}, ${userId}, 0, 'My first brand', COALESCE((SELECT profile FROM copyrail_profiles WHERE user_id = ${userId}), ${JSON.stringify(starterProfile)}::jsonb)
    WHERE EXISTS (SELECT 1 FROM copyrail_users WHERE id = ${userId}) ON CONFLICT (user_id, slot) DO NOTHING`;
}
export async function listBrands(userId: string): Promise<Brand[]> {
  await ensureDefaultBrand(userId);
  const rows = await database()`SELECT id, name, revision, slot, created_at FROM copyrail_brands WHERE user_id = ${userId} ORDER BY slot`;
  return rows.map(row => ({id:String(row.id),name:String(row.name),revision:Number(row.revision),isDefault:Number(row.slot)===0,createdAt:new Date(String(row.created_at)).toISOString()}));
}
export async function getBrand(userId: string, brandId?: string): Promise<BrandWithProfile> {
  await ensureDefaultBrand(userId);
  const rows = await database()`SELECT * FROM copyrail_brands WHERE user_id = ${userId} AND id = ${brandId || userId + "_default"}`;
  if (!rows[0]) throw new ApiError("This brand is not available in your workspace.", 404);
  return fromRow(rows[0]);
}
export async function createBrand(userId: string, name: string): Promise<Brand> {
  if (!name.trim() || name.trim().length > 80) throw new ApiError("Use a brand name between 1 and 80 characters.");
  await ensureDefaultBrand(userId);
  for (let attempt=0; attempt<5; attempt++) {
    const rows = await database()`INSERT INTO copyrail_brands (id, user_id, slot, name, profile)
      SELECT ${"brand_" + randomUUID()}, ${userId}, candidate, ${name.trim()}, '{"mustUse":[],"mustAvoid":[],"bannedClaims":[]}'::jsonb
      FROM generate_series(1,4) AS candidate
      WHERE NOT EXISTS (SELECT 1 FROM copyrail_brands WHERE user_id = ${userId} AND slot = candidate)
      ORDER BY candidate LIMIT 1 ON CONFLICT (user_id, slot) DO NOTHING RETURNING *`;
    if (rows[0]) { const row=fromRow(rows[0]); return {id:row.id,name:row.name,revision:row.revision,isDefault:row.isDefault,createdAt:row.createdAt}; }
  }
  throw new ApiError("The free preview includes five brands. Rename an existing brand to reuse it.", 409);
}
export async function renameBrand(userId: string, brandId: string, name: string): Promise<Brand> {
  if (!name.trim() || name.trim().length > 80) throw new ApiError("Use a brand name between 1 and 80 characters.");
  await getBrand(userId,brandId);
  const rows = await database()`UPDATE copyrail_brands SET name = ${name.trim()} WHERE id = ${brandId} AND user_id = ${userId} RETURNING *`;
  const row=fromRow(rows[0]); return {id:row.id,name:row.name,revision:row.revision,isDefault:row.isDefault,createdAt:row.createdAt};
}
