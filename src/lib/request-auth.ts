import { cookies } from "next/headers";
import {
  cookieOptions,
  createSession,
  DATA_COOKIE,
  decodeToken,
  encodeToken,
  readSession,
  SESSION_COOKIE,
} from "./auth";
import {
  hydrateFromReplica,
  replicaFor,
  type CookieReplica,
  type User,
  getUserById,
} from "./store";

export async function currentUser(): Promise<User | null> {
  const jar = await cookies();
  const session = readSession(jar.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const replica = decodeToken<CookieReplica>(jar.get(DATA_COOKIE)?.value);
  hydrateFromReplica(session.userId, replica);
  return getUserById(session.userId) ?? null;
}

export async function setAuthCookies(user: User): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSession(user.id, user.email), cookieOptions);
  jar.set(DATA_COOKIE, encodeToken(replicaFor(user.id)), cookieOptions);
}

export async function clearAuthCookies(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  jar.set(DATA_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}

export async function refreshDataCookie(userId: string): Promise<void> {
  const jar = await cookies();
  jar.set(DATA_COOKIE, encodeToken(replicaFor(userId)), cookieOptions);
}
