"use client";

import { useState } from "react";
import type { BrandProfile } from "@/lib/brand-check";

type Props = {
  initial: BrandProfile;
};

function toText(list: string[]) {
  return list.join("\n");
}

export function ProfileEditor({ initial }: Props) {
  const [mustUse, setMustUse] = useState(toText(initial.mustUse));
  const [mustAvoid, setMustAvoid] = useState(toText(initial.mustAvoid));
  const [bannedClaims, setBannedClaims] = useState(toText(initial.bannedClaims));
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setStatus("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mustUse, mustAvoid, bannedClaims }),
      });
      const data = (await res.json()) as { profile?: BrandProfile; error?: string };
      if (!res.ok) {
        setError(data.error || "Save failed.");
        return;
      }
      if (data.profile) {
        setMustUse(toText(data.profile.mustUse));
        setMustAvoid(toText(data.profile.mustAvoid));
        setBannedClaims(toText(data.profile.bannedClaims));
      }
      setStatus("Rails saved.");
    } catch {
      setError("Could not save rails.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="max-w-3xl space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Brand rails</h1>
          <p className="mt-1 text-sm text-mute">
            One term per line, or a comma list. The checker reads these lists
            on every run.
          </p>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="bg-ink px-4 py-2 text-sm text-paper hover:bg-proof disabled:opacity-60"
        >
          {busy ? "Saving..." : "Save rails"}
        </button>
      </div>

      <label className="block text-xs font-medium uppercase tracking-wide text-mute">
        Must use
        <textarea
          value={mustUse}
          onChange={(event) => setMustUse(event.target.value)}
          rows={6}
          className="mt-2 w-full border border-rule bg-white px-3 py-3 text-base outline-none focus:border-ink"
        />
      </label>
      <label className="block text-xs font-medium uppercase tracking-wide text-mute">
        Must avoid
        <textarea
          value={mustAvoid}
          onChange={(event) => setMustAvoid(event.target.value)}
          rows={6}
          className="mt-2 w-full border border-rule bg-white px-3 py-3 text-base outline-none focus:border-ink"
        />
      </label>
      <label className="block text-xs font-medium uppercase tracking-wide text-mute">
        Banned claims
        <textarea
          value={bannedClaims}
          onChange={(event) => setBannedClaims(event.target.value)}
          rows={6}
          className="mt-2 w-full border border-rule bg-white px-3 py-3 text-base outline-none focus:border-ink"
        />
      </label>
      {error ? (
        <p className="text-sm text-proof" role="alert">
          {error}
        </p>
      ) : null}
      {status ? (
        <p className="text-sm" role="status">
          {status}
        </p>
      ) : null}
    </form>
  );
}
