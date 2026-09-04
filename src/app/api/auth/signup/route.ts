import { NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/request-auth";
import { createUser } from "@/lib/store";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: string; password?: string; name?: string }
    | null;
  try {
    const user = createUser({
      email: body?.email ?? "",
      password: body?.password ?? "",
      name: body?.name ?? "",
    });
    await setAuthCookies(user);
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.plan,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not create account.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
