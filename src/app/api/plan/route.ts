import { NextResponse } from "next/server";
import { currentUser, refreshDataCookie } from "@/lib/request-auth";
import { setPlan, type User } from "@/lib/store";

const PLANS: User["plan"][] = ["starter", "team", "desk"];

export async function PUT(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { plan?: string } | null;
  const plan = body?.plan as User["plan"] | undefined;
  if (!plan || !PLANS.includes(plan)) {
    return NextResponse.json({ error: "Choose starter, team, or desk." }, { status: 400 });
  }
  const next = setPlan(user.id, plan);
  await refreshDataCookie(user.id);
  return NextResponse.json({
    id: next.id,
    email: next.email,
    name: next.name,
    plan: next.plan,
  });
}
