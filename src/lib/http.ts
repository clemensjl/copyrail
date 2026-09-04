import { NextResponse } from "next/server";
import { normalizeList, type BrandProfile } from "@/lib/brand-check";

export function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function errorJson(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function asList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item).trim())
      .filter((item) => item.length > 0);
  }
  if (typeof value === "string") return normalizeList(value);
  return [];
}

export function profileFromBody(body: unknown): BrandProfile {
  const record = (body ?? {}) as Record<string, unknown>;
  return {
    mustUse: asList(record.mustUse),
    mustAvoid: asList(record.mustAvoid),
    bannedClaims: asList(record.bannedClaims),
  };
}

export function publicUser(user: {
  id: string;
  email: string;
  name: string;
  plan: string;
  createdAt: string;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    plan: user.plan,
    createdAt: user.createdAt,
  };
}
