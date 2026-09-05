import { cookies } from "next/headers";
import { cookieOptions, createSession, DATA_COOKIE, readSession, SESSION_COOKIE } from "./auth";
import { type User, getUserById } from "./store";
export async function currentUser(): Promise<User | null> {
  const jar = await cookies();
  const session = readSession(jar.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  return await getUserById(session.userId) ?? null;
}
export async function setAuthCookies(user: User): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, createSession(user.id, user.email), cookieOptions);
  jar.set(DATA_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}
export async function clearAuthCookies(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  jar.set(DATA_COOKIE, "", { ...cookieOptions, maxAge: 0 });
}
