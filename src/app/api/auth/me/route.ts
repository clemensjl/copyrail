import { NextResponse } from "next/server";
import { currentUser } from "@/lib/request-auth";
import { getProfile } from "@/lib/store";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    profile: await getProfile(user.id),
  });
}
