import { api, ApiError, readBody, stringField } from "@/lib/api";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { setAuthCookies } from "@/lib/request-auth";
import { getUserByEmail } from "@/lib/store";
import { publicUser } from "@/lib/http";
import { authRateLimit } from "@/lib/rate-limit";
const DUMMY_HASH = hashPassword("copyrail-timing-placeholder");
export async function POST(request: Request) { return api(async () => {
  const body = await readBody(request);
  const email = stringField(body, "email", 254);
  const password = stringField(body, "password", 128);
  await authRateLimit(request);
  const user = await getUserByEmail(email);
  const valid = verifyPassword(password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !valid) throw new ApiError("Invalid email or password.", 401);
  await setAuthCookies(user);
  return publicUser(user);
}); }
