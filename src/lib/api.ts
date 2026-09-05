import { NextResponse } from "next/server";
export class ApiError extends Error { constructor(message: string, public status = 400) { super(message); } }
export async function readBody(request: Request): Promise<Record<string, unknown>> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) throw new ApiError("Request origin is not allowed.", 403);
  if (!request.headers.get("content-type")?.includes("application/json")) throw new ApiError("Send JSON data.", 415);
  const reader = request.body?.getReader();
  if (!reader) throw new ApiError("Request body is required.");
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 150000) { await reader.cancel(); throw new ApiError("Request is too large.", 413); }
    chunks.push(value);
  }
  try {
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
    return body;
  } catch { throw new ApiError("Send a valid JSON object."); }
}
export function stringField(body: Record<string, unknown>, key: string, max: number, required = true): string {
  const value = body[key];
  if (value === undefined && !required) return "";
  if (typeof value !== "string" || value.length > max || (required && !value.trim())) throw new ApiError(`Enter a valid ${key} (maximum ${max} characters).`);
  return value;
}
export async function api(action: () => Promise<unknown>) {
  try { return NextResponse.json(await action(), { headers: { "Cache-Control": "no-store" } }); }
  catch (error) {
    if (error instanceof ApiError) return NextResponse.json({ error: error.message }, { status: error.status });
    console.error("Copyrail API request failed", error instanceof Error ? error.name : "Unknown error");
    return NextResponse.json({ error: "The service could not complete this request. Please try again." }, { status: 503 });
  }
}
