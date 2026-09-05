import { api, ApiError } from "@/lib/api";
export async function PUT() { return api(async () => { throw new ApiError("Paid subscriptions are not available yet. Your preview workspace is free.", 409); }); }
