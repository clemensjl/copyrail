import { api, ApiError } from "@/lib/api";
import { currentUser } from "@/lib/request-auth";
import { getCheck } from "@/lib/store";
export async function GET(_request:Request, context:{params:Promise<{id:string}>}) {
  const response=await api(async()=>{
    const user=await currentUser();if(!user) throw new ApiError("Sign in to download this report.",401);
    const {id}=await context.params;return getCheck(user.id,id);
  });
  if(response.ok) response.headers.set("Content-Disposition",'attachment; filename="copyrail-report.json"');
  return response;
}
