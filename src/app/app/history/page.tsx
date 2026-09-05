"use client";

import Link from "next/link";
import { useBrand } from "@/components/workspace-shell";
import { useEffect, useState } from "react";
import type { CheckRecord } from "@/lib/types";

export default function HistoryPage() {
  const {brand,link}=useBrand();
  const [loading,setLoading]=useState(true);
  const [rows, setRows] = useState<CheckRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/history?brand=${encodeURIComponent(brand.id)}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRows(data);
        else setError(data.error || "Could not load history.");
      })
      .catch(() => setError("Could not load history.")).finally(()=>setLoading(false));
  }, [brand.id]);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">History</h1>
      <p className="mt-2 text-mute">The latest 100 checks for {brand.name}, newest first. Each report preserves the draft and guidelines used at the time.</p>
      {error ? <p className="mt-6 text-sm text-proof">{error}</p> : null}
      {loading ? <p className="mt-8 text-mute">Loading reviews...</p> : rows.length === 0 && !error ? (
        <p className="mt-8 text-mute">No checks yet. Run one from the checker.</p>
      ) : (
        <ul className="mt-8 space-y-4">
          {rows.map((row) => (
            <li key={row.id} className="rounded-[8px] border border-rule bg-raised p-4">
              <div className="flex items-baseline justify-between gap-4">
                <p className="font-mono text-2xl">{row.result.score}</p>
                <p className="text-xs text-mute">{new Date(row.createdAt).toLocaleString()}</p>
              </div>
              <p className="mt-2 text-sm text-mute">
                {row.result.pass ? "Pass" : "Held"} · {row.result.violations.length} flags
              </p>
              <p className="mt-3 text-sm leading-6">{row.excerpt}</p>
              <Link href={link(`/app/history/${row.id}`)} className="mt-4 inline-block text-sm underline">Open report</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
