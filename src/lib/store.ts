import { randomUUID } from "node:crypto";
import { hashPassword } from "./auth";
import { applyRails, checkCopy, normalizeList, type BrandProfile } from "./brand-check";
import { database, ensureDatabase } from "./db";
import type { CheckRecord } from "./types";
import { getBrand, type BrandWithProfile } from "./brands";
import { ApiError } from "./api";
export type User = { id: string; email: string; passwordHash: string; name: string; plan: "starter" | "team" | "desk" | "demo"; createdAt: string };
export type { CheckRecord };
export function defaultProfile(): BrandProfile {
  return { mustUse: ["Copyrail", "brand voice"], mustAvoid: ["synergy", "world-class"], bannedClaims: ["guaranteed results", "#1 in the world"] };
}
function userFromRow(row: Record<string, unknown>): User {
  return { id: String(row.id), email: String(row.email), passwordHash: String(row.password_hash), name: String(row.name), plan: row.plan as User["plan"], createdAt: new Date(String(row.created_at)).toISOString() };
}
export async function getUserByEmail(email: string): Promise<User | undefined> {
  await ensureDatabase();
  const rows = await database()`SELECT * FROM copyrail_users WHERE email = ${email.trim().toLowerCase()}`;
  return rows[0] ? userFromRow(rows[0]) : undefined;
}
export async function getUserById(id: string): Promise<User | undefined> {
  await ensureDatabase();
  const rows = await database()`SELECT * FROM copyrail_users WHERE id = ${id}`;
  return rows[0] ? userFromRow(rows[0]) : undefined;
}
export async function createUser(input: { email: string; password: string; name: string }): Promise<User> {
  const email = input.email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) throw new Error("Enter a valid email address.");
  if (input.password.length < 12 || input.password.length > 128) throw new Error("Use a password between 12 and 128 characters.");
  if (input.name.length > 100) throw new Error("Name must be 100 characters or fewer.");
  await ensureDatabase();
  const id = `user_${randomUUID()}`;
  const passwordHash = hashPassword(input.password);
  const rows = await database()`INSERT INTO copyrail_users (id, email, password_hash, name) VALUES (${id}, ${email}, ${passwordHash}, ${input.name.trim() || email.split("@")[0]}) ON CONFLICT (email) DO NOTHING RETURNING *`;
  if (!rows[0]) throw new Error("An account with that email already exists. Sign in instead.");
  return userFromRow(rows[0]);
}
export async function getProfile(userId: string, brandId?: string): Promise<BrandProfile> {
  return (await getBrand(userId, brandId)).profile;
}
export async function saveProfile(userId: string, incoming: Partial<BrandProfile>, brandId?: string): Promise<BrandProfile> {
  const next = { mustUse: normalizeList(incoming.mustUse), mustAvoid: normalizeList(incoming.mustAvoid), bannedClaims: normalizeList(incoming.bannedClaims) };
  for (const list of Object.values(next)) {
    if (list.length > 100 || list.some(term => term.length > 200)) throw new ApiError("Use up to 100 phrases per list, each at most 200 characters.");
  }
  const brand=await getBrand(userId,brandId);
  await database()`UPDATE copyrail_brands SET profile=${JSON.stringify(next)}::jsonb, revision=revision+1 WHERE id=${brand.id} AND user_id=${userId}`;
  return next;
}
export async function getHistory(userId: string, brandId?: string): Promise<CheckRecord[]> {
  const brand=await getBrand(userId,brandId);
  const rows = await database()`SELECT record FROM copyrail_checks WHERE user_id = ${userId} AND (brand_id = ${brand.id} OR (${brand.isDefault} AND brand_id IS NULL)) ORDER BY created_at DESC LIMIT 100`;
  return rows.map(row => row.record as CheckRecord);
}
export async function getCheck(userId: string, checkId: string): Promise<CheckRecord> {
  await ensureDatabase();
  const rows = await database()`SELECT record FROM copyrail_checks WHERE user_id=${userId} AND id=${checkId}`;
  if (!rows[0]) throw new ApiError("This report is not available in your workspace.",404);
  return rows[0].record as CheckRecord;
}
async function saveCheck(userId: string, copy: string, brand: BrandWithProfile): Promise<CheckRecord> {
  if (!Object.values(brand.profile).some(terms=>terms.length>0)) throw new ApiError("Add at least one guideline for this brand before checking a draft.");
  const record: CheckRecord = { id: `chk_${randomUUID()}`, createdAt: new Date().toISOString(), excerpt: copy.trim().slice(0, 240), copyLength: copy.length, copy, brandId:brand.id, brandName:brand.name, profileSnapshot:brand.profile, profileRevision:brand.revision, result:checkCopy(copy,brand.profile) };
  await database()`INSERT INTO copyrail_checks (id, user_id, brand_id, record) VALUES (${record.id}, ${userId}, ${brand.id}, ${JSON.stringify(record)}::jsonb)`;
  return record;
}
export async function recordCheck(userId: string, copy: string, brandId?: string): Promise<CheckRecord> {
  if (!copy.trim() || copy.length > 30000) throw new ApiError("Paste between 1 and 30,000 characters to check.");
  return saveCheck(userId,copy,await getBrand(userId,brandId));
}
export async function applyAndRecord(userId: string, copy: string, brandId?: string): Promise<{ copy: string; record: CheckRecord }> {
  if (!copy.trim() || copy.length > 30000) throw new ApiError("Paste between 1 and 30,000 characters to check.");
  const brand=await getBrand(userId,brandId);
  const applied=applyRails(copy,brand.profile);
  return {copy:applied.copy,record:await saveCheck(userId,applied.copy,brand)};
}
