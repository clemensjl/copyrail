import { api, ApiError, readBody, stringField } from "@/lib/api";
import { currentUser } from "@/lib/request-auth";
import { applyAndRecord } from "@/lib/store";
export async function POST(request: Request) { return api(async () => {
  const user = await currentUser();
  if (!user) throw new ApiError("Sign in to edit your copy.", 401);
  const body = await readBody(request);
  return applyAndRecord(user.id, stringField(body, "copy", 30000), stringField(body, "brandId", 100, false) || undefined);
}); }
