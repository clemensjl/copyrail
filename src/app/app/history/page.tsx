"use client";

import { useEffect, useState } from "react";
import type { CheckRecord } from "@/lib/types";

export default function HistoryPage() {
  const [rows, setRows] = useState<CheckRecord[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/history")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setRows(data);
        else setError(data.error || "Could not load history.");
      })
      .catch(() => setError("Could not load history."));
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold tracking-tight">History</h1>
      <p className="mt-2 text-mute">Checks saved on this account, newest first.</p>
      {error ? <p className="mt-6 text-sm text-proof">{error}</p> : null}
      {rows.length === 0 && !error ? (
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
