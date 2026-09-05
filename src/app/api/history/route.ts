import { api, ApiError } from "@/lib/api";
import { currentUser } from "@/lib/request-auth";
import { getHistory } from "@/lib/store";
export async function GET(request:Request) { return api(async()=>{
 const user=await currentUser();if(!user) throw new ApiError("Sign in to view history.",401);
 return getHistory(user.id,new URL(request.url).searchParams.get("brand") || undefined);
}); }
