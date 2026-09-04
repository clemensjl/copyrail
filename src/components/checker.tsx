"use client";

import { useState } from "react";
import type { BrandProfile, CheckResult, Violation } from "@/lib/brand-check";
import { PASS_THRESHOLD } from "@/lib/brand-check";
import { Prohibit, Warning, CheckCircle, TextT } from "@phosphor-icons/react";

type Props = {
  profile: BrandProfile;
};

function iconFor(type: Violation["type"]) {
  if (type === "must-avoid" || type === "banned-claim") return Prohibit;
  if (type === "must-use") return Warning;
  return TextT;
}

export function Checker({ profile }: Props) {
  const [copy, setCopy] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function runCheck(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ copy }),
      });
      const data = (await res.json()) as CheckResult & { error?: string };
      if (!res.ok) {
        setError(data.error || "Check failed.");
        return;
      }
      setResult(data);
    } catch {
      setError("Could not reach the checker.");
    } finally {
      setBusy(false);
    }
  }

  const scoreColor = !result
    ? "text-mute"
    : !result.valid || !result.pass
      ? "text-proof"
      : "text-ink";

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
      <form onSubmit={runCheck} className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl tracking-tight">Checker</h1>
            <p className="mt-1 text-sm text-mute">
              Score a draft against the rails saved on this desk. Pass is{" "}
              {PASS_THRESHOLD} or higher with no banned language.
            </p>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="bg-proof px-4 py-2 text-sm text-paper hover:bg-ink disabled:opacity-60"
          >
            {busy ? "Scoring..." : "Run check"}
          </button>
        </div>
        <label className="text-xs font-medium uppercase tracking-wide text-mute">
          Draft
          <textarea
            value={copy}
            onChange={(event) => setCopy(event.target.value)}
            rows={14}
            className="mt-2 w-full border border-rule bg-white px-3 py-3 text-base text-ink outline-none focus:border-ink"
            placeholder="Paste AI copy here. Copyrail will flag must-avoid terms, banned claims, and missing must-use language."
          />
        </label>
        {error ? (
          <p className="text-sm text-proof" role="alert">
            {error}
          </p>
        ) : null}
        <p className="text-xs text-mute">
          Active rails: must-use {profile.mustUse.join(", ") || "none"}.
          Must-avoid {profile.mustAvoid.join(", ") || "none"}. Banned{" "}
          {profile.bannedClaims.join(", ") || "none"}.
        </p>
      </form>

      <aside className="border border-rule bg-white p-5" aria-live="polite">
        <p className="text-xs font-medium uppercase tracking-wide text-mute">
          Score
        </p>
        <p className={`font-mono text-7xl leading-none ${scoreColor}`}>
          {result ? result.score : "--"}
        </p>
        <p className="mt-2 flex items-center gap-2 text-sm">
          {result ? (
            result.pass ? (
              <>
                <CheckCircle size={16} weight="fill" />
                Pass. Threshold {result.passThreshold}.
              </>
            ) : (
              <>
                <Prohibit size={16} weight="fill" className="text-proof" />
                {result.valid ? "Fail." : "Invalid."} Threshold{" "}
                {result.passThreshold}.
              </>
            )
          ) : (
            <span className="text-mute">Run a check to score this draft.</span>
          )}
        </p>
        <ul className="mt-6 space-y-4">
          {(result?.violations ?? []).length === 0 && result?.valid ? (
            <li className="text-sm text-mute">No violations on this draft.</li>
          ) : null}
          {(result?.violations ?? []).map((violation, index) => {
            const Icon = iconFor(violation.type);
            return (
              <li key={`${violation.type}-${violation.term}-${index}`} className="border-t border-rule pt-4">
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-mute">
                  <Icon size={14} />
                  {violation.type}
                </p>
                {violation.term ? (
                  <p className="mt-1 font-mono text-sm">{violation.term}</p>
                ) : null}
                {violation.location ? (
                  <p className="mt-1 font-mono text-xs text-mute">
                    location {violation.location.start}-{violation.location.end}
                  </p>
                ) : null}
                <p className="mt-2 text-sm">{violation.suggestion}</p>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
}
