import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/auth";
import { setAuthCookies } from "@/lib/request-auth";
import { getUserByEmail } from "@/lib/store";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;
  const email = body?.email?.trim() ?? "";
  const password = body?.password ?? "";
  const user = getUserByEmail(email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }
  await setAuthCookies(user);
  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
  });
}
