import { createHash } from "node:crypto";
import { database, ensureDatabase } from "./db";
import { ApiError } from "./api";
export async function authRateLimit(request: Request) {
  await ensureDatabase();
  const sql = database();
  await sql`CREATE TABLE IF NOT EXISTS copyrail_rate_limits (key text PRIMARY KEY, count integer NOT NULL, expires_at timestamptz NOT NULL)`;
  const address = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for") || "local";
  const bucket = Math.floor(Date.now() / 900000);
  const key = createHash("sha256").update(`${address}:${bucket}`).digest("hex");
  const rows = await sql`INSERT INTO copyrail_rate_limits (key, count, expires_at) VALUES (${key}, 1, now() + interval '15 minutes') ON CONFLICT (key) DO UPDATE SET count = copyrail_rate_limits.count + 1 RETURNING count`;
  if (Number(rows[0].count) > 15) throw new ApiError("Too many sign-in attempts. Try again in 15 minutes.", 429);
  await sql`DELETE FROM copyrail_rate_limits WHERE expires_at < now()`;
}
