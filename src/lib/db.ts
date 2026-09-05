import { neon } from "@neondatabase/serverless";
export function database() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured.");
  return neon(process.env.DATABASE_URL);
}
let ready: Promise<void> | undefined;
export function ensureDatabase(): Promise<void> {
  if (!ready) ready = initialize().catch(error => { ready = undefined; throw error; });
  return ready;
}
async function initialize() {
  const sql = database();
  await sql.transaction([
    sql`SELECT pg_advisory_xact_lock(1704973)`,
    sql`CREATE TABLE IF NOT EXISTS copyrail_users (id text PRIMARY KEY, email text UNIQUE NOT NULL, password_hash text NOT NULL, name text NOT NULL, plan text NOT NULL DEFAULT 'starter', created_at timestamptz NOT NULL DEFAULT now())`,
    sql`CREATE TABLE IF NOT EXISTS copyrail_profiles (user_id text PRIMARY KEY REFERENCES copyrail_users(id) ON DELETE CASCADE, profile jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`,
    sql`CREATE TABLE IF NOT EXISTS copyrail_checks (id text PRIMARY KEY, user_id text NOT NULL REFERENCES copyrail_users(id) ON DELETE CASCADE, created_at timestamptz NOT NULL DEFAULT now(), record jsonb NOT NULL)`,
    sql`CREATE INDEX IF NOT EXISTS copyrail_checks_user_date ON copyrail_checks(user_id, created_at DESC)`,
    sql`CREATE TABLE IF NOT EXISTS copyrail_brands (id text PRIMARY KEY, user_id text NOT NULL REFERENCES copyrail_users(id) ON DELETE CASCADE, slot integer NOT NULL CHECK (slot BETWEEN 0 AND 4), name text NOT NULL, profile jsonb NOT NULL, revision integer NOT NULL DEFAULT 1, created_at timestamptz NOT NULL DEFAULT now(), UNIQUE(user_id, slot))`,
    sql`ALTER TABLE copyrail_checks ADD COLUMN IF NOT EXISTS brand_id text`,
    sql`CREATE INDEX IF NOT EXISTS copyrail_checks_brand_date ON copyrail_checks(user_id, brand_id, created_at DESC)`,
    sql`CREATE TABLE IF NOT EXISTS copyrail_rate_limits (key text PRIMARY KEY, count integer NOT NULL, expires_at timestamptz NOT NULL)`,
  ]);
}
