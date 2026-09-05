"use client";

import { FormEvent, useEffect, useState } from "react";

export default function ProfilePage() {
  const [mustUse, setMustUse] = useState("");
  const [mustAvoid, setMustAvoid] = useState("");
  const [bannedClaims, setBannedClaims] = useState("");

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([fetch("/api/profile"), fetch("/api/auth/me")])
      .then(async ([profileRes, meRes]) => {
        const p = await profileRes.json();
        if (!profileRes.ok || !meRes.ok) throw new Error("Load failed");
        setMustUse((p.mustUse ?? []).join("\n"));
        setMustAvoid((p.mustAvoid ?? []).join("\n"));
        setBannedClaims((p.bannedClaims ?? []).join("\n"));
        setLoaded(true);

      })
      .catch(() => setError("Could not load rails."));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    setStatus("");
    try {
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mustUse: mustUse.split("\n"), mustAvoid: mustAvoid.split("\n"), bannedClaims: bannedClaims.split("\n") }),
    });
    const data = await res.json().catch(() => ({}));
    setPending(false);
    if (!res.ok) {
      setError(data.error || "Save failed.");
      return;
    }
    setStatus("Rails saved. Later requests will load this profile.");
    } catch { setError("Connection failed. Your changes have not been saved."); }
    finally { setPending(false); }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Rails</h1>
      <p className="mt-2 text-mute">
        One term per line. These rules score every draft on this account.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <Field label="Must-use terms" value={mustUse} onChange={setMustUse} />
        <Field label="Must-avoid terms" value={mustAvoid} onChange={setMustAvoid} />
        <Field label="Banned claims" value={bannedClaims} onChange={setBannedClaims} />

        {error ? <p className="text-sm text-proof">{error}</p> : null}
        {status ? <p className="text-sm text-ink">{status}</p> : null}
        <button
          type="submit"
          disabled={pending || !loaded}
          className="h-11 rounded-[8px] bg-proof px-5 text-sm font-medium text-proof-ink disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save rails"}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="w-full rounded-[8px] border border-rule bg-raised px-3 py-2 font-mono text-sm"
      />
    </label>
  );
}
