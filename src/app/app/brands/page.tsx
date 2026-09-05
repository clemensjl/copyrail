"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBrand } from "@/components/workspace-shell";
import type { Brand } from "@/lib/brands";
export default function BrandsPage() {
 const {brands,refreshBrands}=useBrand();const router=useRouter();
 const [name,setName]=useState(''),[error,setError]=useState(''),[pending,setPending]=useState(false);
 async function create(event:FormEvent) {event.preventDefault();setPending(true);setError('');try {
  const response=await fetch('/api/brands',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name})});const data=await response.json();if(!response.ok)throw new Error(data.error||'Could not create brand.');
  await refreshBrands();router.push(`/app/profile?brand=${encodeURIComponent(data.id)}`);
 } catch(error) {setError(error instanceof Error?error.message:'Could not create brand.');} finally {setPending(false);} }
 return <div className="max-w-4xl"><h1 className="font-display text-3xl font-semibold">Your brands</h1><p className="mt-3 text-mute">Separate guidelines and review histories for every client. The free preview includes up to five brands.</p>
 <div className="mt-8 grid gap-4 md:grid-cols-2">{brands.map(brand=><BrandCard key={brand.id} brand={brand} onSave={refreshBrands}/>)}</div>
 <form onSubmit={create} className="mt-8 rounded-lg border border-rule bg-raised p-6"><h2 className="text-xl font-semibold">Add a client brand</h2><label className="mt-4 block text-sm" htmlFor="brand-name">Brand name</label><div className="mt-2 flex flex-wrap gap-3"><input id="brand-name" required maxLength={80} value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Northstar Studio" className="min-w-0 flex-1 rounded-lg border border-rule bg-paper px-3 py-2"/><button disabled={pending||brands.length>=5} className="rounded-lg bg-proof px-4 py-2 text-sm font-medium text-proof-ink disabled:opacity-50">{pending?'Creating...':'Create brand'}</button></div>{error?<p role="alert" className="mt-3 text-sm text-proof">{error}</p>:null}{brands.length>=5?<p className="mt-3 text-sm text-mute">All five brand spaces are in use. You can rename existing brands.</p>:null}</form>
 </div>;
}
function BrandCard({brand,onSave}:{brand:Brand;onSave:()=>Promise<void>}) {
 const [name,setName]=useState(brand.name),[editing,setEditing]=useState(false),[error,setError]=useState(''),[pending,setPending]=useState(false);
 async function save(event:FormEvent) {event.preventDefault();setPending(true);setError('');try {const response=await fetch('/api/brands',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id:brand.id,name})});const data=await response.json();if(!response.ok)throw new Error(data.error);await onSave();setEditing(false);}catch(error){setError(error instanceof Error?error.message:'Could not rename brand.');}finally{setPending(false);}}
 return <section className="rounded-lg border border-rule bg-raised p-6">
 {editing?<form onSubmit={save}><label className="block text-sm" htmlFor={`rename-${brand.id}`}>New brand name</label><input id={`rename-${brand.id}`} value={name} onChange={e=>setName(e.target.value)} maxLength={80} required className="mt-2 w-full rounded-lg border border-rule bg-paper px-3 py-2"/><div className="mt-3 flex gap-4"><button disabled={pending} className="text-sm underline">{pending?'Saving...':'Save name'}</button><button type="button" onClick={()=>setEditing(false)} className="text-sm text-mute">Cancel</button></div></form>:<><h2 className="break-words text-xl font-semibold">{brand.name}</h2><p className="mt-2 text-sm text-mute">Guidelines revision {brand.revision}</p><div className="mt-5 flex flex-wrap gap-4 text-sm"><Link href={`/app/profile?brand=${encodeURIComponent(brand.id)}`} className="underline">Edit guidelines</Link><Link href={`/app/history?brand=${encodeURIComponent(brand.id)}`} className="underline">View history</Link><button onClick={()=>setEditing(true)} className="text-mute underline">Rename</button></div></>}
 {error?<p role="alert" className="mt-3 text-sm text-proof">{error}</p>:null}
 </section>;
}
