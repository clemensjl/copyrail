import { api, ApiError, readBody } from "@/lib/api";
import { currentUser } from "@/lib/request-auth";
import { getProfile, saveProfile } from "@/lib/store";
import type { BrandProfile } from "@/lib/brand-check";
export async function GET() { return api(async () => {
  const user = await currentUser();
  if (!user) throw new ApiError("Sign in to view guidelines.", 401);
  return getProfile(user.id);
}); }
export async function PUT(request: Request) { return api(async () => {
  const user = await currentUser();
  if (!user) throw new ApiError("Sign in to save guidelines.", 401);
  const body = await readBody(request);
  for (const key of ["mustUse", "mustAvoid", "bannedClaims"]) {
    const value = body[key];
    if (!Array.isArray(value) || value.length > 100 || value.some(v => typeof v !== "string" || v.length > 200)) throw new ApiError("Each list supports up to 100 phrases, each at most 200 characters.");
  }
  return saveProfile(user.id, body as BrandProfile);
}); }
