import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { currentUser } from "@/lib/request-auth";
import { getCheck } from "@/lib/store";
import { ApiError } from "@/lib/api";
import { MarkedCopy } from "@/components/marked-copy";
import { PrintReport } from "@/components/print-report";
export default async function ReportPage({params}:{params:Promise<{id:string}>}) {
 const user=await currentUser();if(!user)redirect('/login');
 const {id}=await params;
 let report;
 try {report=await getCheck(user.id,id);}catch(error){if(error instanceof ApiError&&error.status===404)notFound();throw error;}
 const fullCopy=report.copy;
 return <article className="mx-auto max-w-4xl">
  <div className="mb-6 flex flex-wrap gap-3 print:hidden"><Link href={`/app/history${report.brandId?`?brand=${encodeURIComponent(report.brandId)}`:''}`} className="mr-auto text-sm underline">Back to history</Link><a href={`/api/reports/${encodeURIComponent(id)}`} className="rounded-lg border border-rule px-4 py-2 text-sm">Download JSON</a><PrintReport/></div>
  <p className="text-sm font-medium text-mute">{report.brandName||'Original workspace'} / saved review</p>
  <h1 className="font-display mt-3 text-3xl font-semibold">{report.result.pass?'Clears the guidelines':'Needs changes'}</h1>
  <p className="mt-3 text-sm text-mute">{new Date(report.createdAt).toLocaleString('en-GB',{timeZone:'UTC'})} UTC{report.profileRevision?` / Guidelines revision ${report.profileRevision}`:''}</p>
  <div className="mt-8 flex flex-wrap items-center gap-6 rounded-lg border border-rule bg-raised p-6"><span className={`font-mono text-6xl ${report.result.pass?'text-ink':'text-proof'}`}>{report.result.score}<span className="text-lg text-mute">/100</span></span><p className="max-w-lg text-sm text-mute">{report.result.violations.length} flags across {report.copyLength.toLocaleString()} characters. This is a phrase-policy check, not legal approval or a factual accuracy assessment.</p></div>
  <h2 className="mt-8 text-xl font-semibold">Reviewed draft</h2>
  {fullCopy!==undefined?<div className="mt-4 whitespace-pre-wrap break-words"><MarkedCopy copy={fullCopy} violations={report.result.violations}/></div>:<><p className="mt-3 text-sm text-mute">This older check saved only an excerpt. Its complete draft and guidelines were not retained.</p><p className="mt-4 whitespace-pre-wrap">{report.excerpt}</p></>}
  <h2 className="mt-8 text-xl font-semibold">Review findings</h2>
  {report.result.violations.length?<ul className="mt-4 space-y-4">{report.result.violations.map((v,i)=><li key={i} className="rounded-lg border border-rule p-4"><p className="text-xs uppercase tracking-wide text-proof">{v.type}</p><p className="mt-2 break-words font-semibold">{v.term||'Empty draft'}</p><p className="mt-2 text-sm text-mute">{v.suggestion}</p></li>)}</ul>:<p className="mt-4 text-mute">No configured phrase rules were violated.</p>}
  {report.profileSnapshot?<section className="mt-8 border-t border-rule pt-6"><h2 className="text-xl font-semibold">Guidelines used for this review</h2><p className="mt-2 text-sm text-mute">An immutable snapshot. Later changes to your brand guidelines do not change this report.</p><div className="mt-5 grid gap-6 sm:grid-cols-3">{([['Required phrases',report.profileSnapshot.mustUse],['Restricted phrases',report.profileSnapshot.mustAvoid],['Prohibited claims',report.profileSnapshot.bannedClaims]] as const).map(([title,terms])=><div key={title}><h3 className="text-sm font-semibold">{title}</h3><ul className="mt-2 space-y-2 text-sm text-mute">{terms.length?terms.map(term=><li key={term} className="break-words">{term}</li>):<li>None configured</li>}</ul></div>)}</div></section>:null}
  <p className="mt-10 break-all text-xs text-mute">Copyrail report {report.id}</p>
 </article>;
}
