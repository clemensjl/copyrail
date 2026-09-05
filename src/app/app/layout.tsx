import { redirect } from "next/navigation";
import { currentUser } from "@/lib/request-auth";
import { listBrands } from "@/lib/brands";
import { WorkspaceShell } from "@/components/workspace-shell";
export default async function AppLayout({children}:{children:React.ReactNode}) {
 const user=await currentUser();if(!user)redirect('/login');
 return <WorkspaceShell email={user.email} initialBrands={await listBrands(user.id)}>{children}</WorkspaceShell>;
}
