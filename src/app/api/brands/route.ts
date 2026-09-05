import { api, ApiError, readBody, stringField } from "@/lib/api";
import { currentUser } from "@/lib/request-auth";
import { listBrands, createBrand, renameBrand } from "@/lib/brands";
export async function GET() { return api(async()=>{
  const user=await currentUser();if(!user) throw new ApiError("Sign in to view brands.",401);
  return listBrands(user.id);
}); }
export async function POST(request:Request) { return api(async()=>{
  const user=await currentUser();if(!user) throw new ApiError("Sign in to create a brand.",401);
  const body=await readBody(request);return createBrand(user.id,stringField(body,"name",80));
}); }
export async function PATCH(request:Request) { return api(async()=>{
  const user=await currentUser();if(!user) throw new ApiError("Sign in to rename a brand.",401);
  const body=await readBody(request);return renameBrand(user.id,stringField(body,"id",100),stringField(body,"name",80));
}); }
