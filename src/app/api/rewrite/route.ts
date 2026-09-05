import { NextResponse } from "next/server";
import { currentUser, refreshDataCookie } from "@/lib/request-auth";
import { applyAndRecord } from "@/lib/store";

export async function POST(request: Request) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { copy?: string } | null;
  const applied = applyAndRecord(user.id, body?.copy ?? "");
  await refreshDataCookie(user.id);
  return NextResponse.json(applied);
}
