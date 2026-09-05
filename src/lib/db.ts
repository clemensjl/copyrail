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
  await sql`CREATE TABLE IF NOT EXISTS copyrail_users (id text PRIMARY KEY, email text UNIQUE NOT NULL, password_hash text NOT NULL, name text NOT NULL, plan text NOT NULL DEFAULT 'starter', created_at timestamptz NOT NULL DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS copyrail_profiles (user_id text PRIMARY KEY REFERENCES copyrail_users(id) ON DELETE CASCADE, profile jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`;
  await sql`CREATE TABLE IF NOT EXISTS copyrail_checks (id text PRIMARY KEY, user_id text NOT NULL REFERENCES copyrail_users(id) ON DELETE CASCADE, created_at timestamptz NOT NULL DEFAULT now(), record jsonb NOT NULL)`;
  await sql`CREATE INDEX IF NOT EXISTS copyrail_checks_user_date ON copyrail_checks(user_id, created_at DESC)`;
}
