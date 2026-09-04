import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import { hashPassword } from "./auth";
import { checkCopy, normalizeList, type BrandProfile } from "./brand-check";
import type { CheckRecord } from "./types";

export const DEMO_EMAIL = "demo@copyrail.app";
export const DEMO_PASSWORD = "copyrail-demo";

export type User = {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  plan: "starter" | "team" | "desk" | "demo";
  createdAt: string;
};

export type { CheckRecord };

type StoreShape = {
  users: User[];
  profiles: Record<string, BrandProfile>;
  history: Record<string, CheckRecord[]>;
};

const STORE_PATH = join(process.cwd(), "data", "store.json");
const HISTORY_LIMIT = 20;

const g = globalThis as typeof globalThis & { __copyrailStore?: StoreShape };

function emptyStore(): StoreShape {
  return { users: [], profiles: {}, history: {} };
}

function loadFromDisk(): StoreShape | null {
  try {
    const raw = readFileSync(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as StoreShape;
    if (!parsed || !Array.isArray(parsed.users)) return null;
    parsed.profiles ??= {};
    parsed.history ??= {};
    return parsed;
  } catch {
    return null;
  }
}

function saveToDisk(store: StoreShape): void {
  try {
    mkdirSync(dirname(STORE_PATH), { recursive: true });
    writeFileSync(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
  } catch {
    // Vercel serverless filesystem is read-only; memory + cookies still hold the session.
  }
}

function memory(): StoreShape {
  if (!g.__copyrailStore) {
    g.__copyrailStore = loadFromDisk() ?? emptyStore();
  }
  return g.__copyrailStore;
}

function persist(): void {
  saveToDisk(memory());
}

export function defaultProfile(): BrandProfile {
  return {
    mustUse: ["Copyrail", "brand voice"],
    mustAvoid: ["synergy", "world-class"],
    bannedClaims: ["guaranteed results", "#1 in the world"],
  };
}

export function resetStore(): void {
  g.__copyrailStore = emptyStore();
}

export function ensureSeeded(): void {
  const store = memory();
  if (store.users.some((u) => u.email === DEMO_EMAIL)) return;
  const demo: User = {
    id: "user_demo",
    email: DEMO_EMAIL,
    passwordHash: hashPassword(DEMO_PASSWORD),
    name: "Desk demo",
    plan: "demo",
    createdAt: new Date().toISOString(),
  };
  store.users.push(demo);
  store.profiles[demo.id] = defaultProfile();
  store.history[demo.id] = [];
  persist();
}

export function getUserByEmail(email: string): User | undefined {
  ensureSeeded();
  return memory().users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserById(id: string): User | undefined {
  ensureSeeded();
  return memory().users.find((u) => u.id === id);
}

export function createUser(input: {
  email: string;
  password: string;
  name: string;
}): User {
  ensureSeeded();
  const email = input.email.trim().toLowerCase();
  if (!email || !input.password) {
    throw new Error("Email and password are required.");
  }
  if (getUserByEmail(email)) {
    throw new Error("An account with that email already exists.");
  }
  const user: User = {
    id: `user_${randomUUID()}`,
    email,
    passwordHash: hashPassword(input.password),
    name: input.name.trim() || email.split("@")[0],
    plan: "starter",
    createdAt: new Date().toISOString(),
  };
  const store = memory();
  store.users.push(user);
  store.profiles[user.id] = defaultProfile();
  store.history[user.id] = [];
  persist();
  return user;
}

export function getProfile(userId: string): BrandProfile {
  ensureSeeded();
  const store = memory();
  if (!store.profiles[userId]) {
    store.profiles[userId] = defaultProfile();
    persist();
  }
  return store.profiles[userId];
}

export function saveProfile(userId: string, incoming: Partial<BrandProfile>): BrandProfile {
  ensureSeeded();
  const next: BrandProfile = {
    mustUse: normalizeList(incoming.mustUse),
    mustAvoid: normalizeList(incoming.mustAvoid),
    bannedClaims: normalizeList(incoming.bannedClaims),
  };
  memory().profiles[userId] = next;
  persist();
  return next;
}

export function getHistory(userId: string): CheckRecord[] {
  ensureSeeded();
  return memory().history[userId] ?? [];
}

export function recordCheck(userId: string, copy: string): CheckRecord {
  ensureSeeded();
  const profile = getProfile(userId);
  const result = checkCopy(copy, profile);
  const record: CheckRecord = {
    id: `chk_${randomUUID()}`,
    createdAt: new Date().toISOString(),
    excerpt: copy.trim().slice(0, 240),
    copyLength: copy.length,
    result,
  };
  const store = memory();
  const list = store.history[userId] ?? [];
  list.unshift(record);
  store.history[userId] = list.slice(0, HISTORY_LIMIT);
  persist();
  return record;
}

export type CookieReplica = {
  profile: BrandProfile;
  history: CheckRecord[];
};

export function replicaFor(userId: string): CookieReplica {
  return {
    profile: getProfile(userId),
    history: getHistory(userId).slice(0, 8),
  };
}

export function hydrateFromReplica(userId: string, replica: CookieReplica | null): void {
  if (!replica) return;
  const store = memory();
  if (!store.profiles[userId] && replica.profile) {
    store.profiles[userId] = replica.profile;
  }
  if ((!store.history[userId] || store.history[userId].length === 0) && replica.history) {
    store.history[userId] = replica.history;
  }
}
