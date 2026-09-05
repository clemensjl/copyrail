"use client";

import { FormEvent, useState } from "react";
import { MarkedCopy } from "@/components/marked-copy";
import type { CheckRecord } from "@/lib/types";

export default function CheckerPage() {
  const [copy, setCopy] = useState(
    "Copyrail keeps our brand voice consistent, with world-class synergy in every line.",
  );
  const [record, setRecord] = useState<CheckRecord | null>(null);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<"check" | "apply" | null>(null);

  async function runCheck(e: FormEvent) {
    e.preventDefault();
    setPending("check");
    setError("");
    const res = await fetch("/api/check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ copy }),
    });
    const data = await res.json().catch(() => ({}));
    setPending(null);
    if (!res.ok) {
      setError(data.error || "Check failed.");
      return;
    }
    setRecord(data as CheckRecord);
  }

  async function applyRails() {
    setPending("apply");
    setError("");
    const res = await fetch("/api/rewrite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ copy }),
    });
    const data = await res.json().catch(() => ({}));
    setPending(null);
    if (!res.ok) {
      setError(data.error || "Apply failed.");
      return;
    }
    setCopy(data.copy as string);
    setRecord(data.record as CheckRecord);
  }

  const result = record?.result;
  const located = result?.violations.some((v) => v.location) ?? false;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Checker</h1>
        <p className="mt-2 max-w-[50ch] text-mute">
          Paste a draft. Copyrail scores it against the rails saved on this account.
        </p>
        <form onSubmit={runCheck} className="mt-6">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Copy</span>
            <textarea
              value={copy}
              onChange={(e) => setCopy(e.target.value)}
              rows={14}
              className="w-full resize-y rounded-[8px] border border-rule bg-raised px-4 py-3 leading-7"
            />
          </label>
          {error ? <p className="mt-3 text-sm text-proof">{error}</p> : null}
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={pending !== null}
              className="h-11 rounded-[8px] bg-proof px-5 text-sm font-medium text-proof-ink disabled:opacity-60"
            >
              {pending === "check" ? "Scoring..." : "Run check"}
            </button>
            <button
              type="button"
              onClick={applyRails}
              disabled={pending !== null}
              className="h-11 rounded-[8px] border border-rule bg-raised px-5 text-sm font-medium disabled:opacity-60"
            >
              {pending === "apply" ? "Applying..." : "Apply rails"}
            </button>
          </div>
        </form>
        {located && record ? (
          <div className="mt-6">
            <p className="mb-2 text-sm font-medium">Located flags</p>
            <MarkedCopy copy={copy} violations={result!.violations} />
          </div>
        ) : null}
      </div>
      <aside className="rounded-[8px] border border-rule bg-raised p-6">
        <p className="text-sm text-mute">Score</p>
        <p
          className={`font-mono text-7xl leading-[1.1] pb-1 ${
            result && !result.pass ? "text-proof" : "text-ink"
          }`}
        >
          {result ? result.score : "--"}
        </p>
        <p className="mt-2 text-sm text-mute">
          {!result
            ? "Run a check to see the score."
            : !result.valid
              ? "Empty copy is invalid, not a pass."
              : result.pass
                ? "Clears the rail."
                : "Held below the pass threshold."}
        </p>
        <ul className="mt-6 space-y-3">
          {result?.violations.map((v, i) => (
            <li key={`${v.type}-${i}`} className="border-t border-rule pt-3">
              <p className="font-mono text-xs uppercase tracking-wide text-proof">
                {v.type}
                {v.location ? ` @ ${v.location.start}-${v.location.end}` : ""}
              </p>
              {v.term ? <p className="mt-1 font-medium">{v.term}</p> : null}
              <p className="mt-1 text-sm text-mute">{v.suggestion}</p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
