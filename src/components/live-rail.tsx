"use client";

import { useMemo, useState } from "react";
import { checkCopy, type BrandProfile } from "@/lib/brand-check";

const SAMPLE_PROFILE: BrandProfile = {
  mustUse: ["Northstar", "patients first"],
  mustAvoid: ["synergy"],
  bannedClaims: ["cures everything"],
};

const SAMPLE_COPY =
  "Northstar brings synergy to every clinic visit and still puts patients first.";

export function LiveRail() {
  const [copy, setCopy] = useState(SAMPLE_COPY);
  const result = useMemo(() => checkCopy(copy, SAMPLE_PROFILE), [copy]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <label className="block">
        <span className="mb-2 block text-sm font-medium text-mute">Draft copy</span>
        <textarea
          value={copy}
          onChange={(e) => setCopy(e.target.value)}
          rows={9}
          className="w-full resize-y rounded-[8px] border border-rule bg-raised px-4 py-3 text-[15px] leading-7 text-ink"
        />
      </label>
      <div className="rounded-[8px] border border-rule bg-raised p-5">
        <p className="text-sm text-mute">Score</p>
        <p
          className={`font-mono text-6xl font-medium leading-[1.1] pb-1 ${
            result.pass ? "text-ink" : "text-proof"
          }`}
        >
          {result.score}
        </p>
        <p className="mt-1 text-sm text-mute">
          {result.valid
            ? result.pass
              ? "Clears the rail."
              : "Held. Fix the flags below."
            : "Nothing to score yet."}
        </p>
        <ul className="mt-5 space-y-3">
          {result.violations.length === 0 ? (
            <li className="text-sm text-mute">No violations on this draft.</li>
          ) : (
            result.violations.map((v, i) => (
              <li key={`${v.type}-${v.term}-${i}`} className="border-t border-rule pt-3">
                <p className="font-mono text-xs uppercase tracking-wide text-proof">
                  {v.type}
                  {v.location ? ` @ ${v.location.start}-${v.location.end}` : ""}
                </p>
                {v.term ? <p className="mt-1 text-sm font-medium">{v.term}</p> : null}
                <p className="mt-1 text-sm text-mute">{v.suggestion}</p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
