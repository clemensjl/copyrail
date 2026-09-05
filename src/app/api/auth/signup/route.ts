import { api, ApiError, readBody, stringField } from "@/lib/api";
import { setAuthCookies } from "@/lib/request-auth";
import { createUser } from "@/lib/store";
import { publicUser } from "@/lib/http";
import { authRateLimit } from "@/lib/rate-limit";
export async function POST(request: Request) { return api(async () => {
  const body = await readBody(request);
  const email = stringField(body, "email", 254);
  const password = stringField(body, "password", 128);
  const name = stringField(body, "name", 100, false);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new ApiError("Enter a valid email address.");
  if (password.length < 12) throw new ApiError("Use a password with at least 12 characters.");
  await authRateLimit(request);
  let user;
  try { user = await createUser({ email, password, name }); }
  catch (error) {
    if (error instanceof Error && error.message.startsWith("An account")) throw new ApiError(error.message, 409);
    throw error;
  }
  await setAuthCookies(user);
  return publicUser(user);
}); }
