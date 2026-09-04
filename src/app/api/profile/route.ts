import { NextResponse } from "next/server";
import { currentUser, refreshDataCookie } from "@/lib/request-auth";
import { getProfile, saveProfile } from "@/lib/store";
import type { BrandProfile } from "@/lib/brand-check";

export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return NextResponse.json(getProfile(user.id));
}

export async function PUT(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as Partial<BrandProfile> | null;
  const profile = saveProfile(user.id, body ?? {});
  await refreshDataCookie(user.id);
  return NextResponse.json(profile);
}
