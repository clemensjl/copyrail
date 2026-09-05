"use client";
import { createContext, useContext, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Brand } from "@/lib/brands";
import { BrandMark } from "./brand-mark";
import { LogoutButton } from "./logout-button";

type BrandContextValue={brand:Brand;brands:Brand[];refreshBrands:()=>Promise<void>;link:(path:string)=>string};
const BrandContext=createContext<BrandContextValue|null>(null);
export function useBrand() {const value=useContext(BrandContext);if(!value)throw new Error("Brand workspace is missing.");return value;}
export function WorkspaceShell({initialBrands,email,children}:{initialBrands:Brand[];email:string;children:React.ReactNode}) {
 const [brands,setBrands]=useState(initialBrands);
 const params=useSearchParams(),pathname=usePathname(),router=useRouter();
 const selected=params.get("brand");
 const brand=brands.find(b=>b.id===selected)||brands[0];
 const invalid=Boolean(selected&&!brands.some(b=>b.id===selected));
 const link=(path:string)=>`${path}?brand=${encodeURIComponent(brand.id)}`;
 async function refreshBrands() {const response=await fetch("/api/brands");if(!response.ok)throw new Error("Could not refresh brands.");setBrands(await response.json());}
 return <BrandContext.Provider value={{brand,brands,refreshBrands,link}}>
  <div className="min-h-[100dvh] bg-paper text-ink">
   <header className="border-b border-rule">
    <div className="mx-auto flex min-h-16 max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
     <BrandMark href={link("/app")}/>
     <nav className="flex w-full items-center justify-between gap-4 text-sm sm:w-auto" aria-label="Workspace">
      {[['/app','Checker'],['/app/profile','Rails'],['/app/history','History'],['/app/brands','Brands']].map(([path,name])=><Link key={path} href={link(path)} aria-current={pathname===path?'page':undefined} className={pathname===path?'font-semibold text-ink':'text-mute hover:text-ink'}>{name}</Link>)}
      <span className="hidden max-w-56 truncate text-mute lg:inline" title={email}>{email}</span><LogoutButton/>
     </nav>
    </div>
   </header>
   <div className="mx-auto max-w-[1400px] px-4 py-6 md:px-8">
    <div className="mb-8 flex flex-wrap items-center gap-3 border-b border-rule pb-5 print:hidden">
     <label htmlFor="active-brand" className="text-sm font-medium">Active brand</label>
     <select id="active-brand" value={brand.id} onChange={e=>router.push(`${pathname.startsWith('/app/history/')?'/app/history':pathname}?brand=${encodeURIComponent(e.target.value)}`)} className="max-w-full rounded-lg border border-rule bg-raised px-3 py-2 text-sm">
      {brands.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
     </select>
     <Link href={link('/app/brands')} className="text-sm text-mute underline">Manage brands</Link>
    </div>
    {invalid?<div role="alert"><h1 className="text-2xl font-semibold">Brand unavailable</h1><p className="mt-3">This brand does not belong to your workspace.</p><Link href="/app" className="mt-4 inline-block underline">Return to your workspace</Link></div>:<div key={brand.id}>{children}</div>}
   </div>
  </div>
 </BrandContext.Provider>;
}
