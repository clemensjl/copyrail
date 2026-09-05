"use client";

import { FormEvent, useEffect, useState } from "react";

export default function ProfilePage() {
  const [mustUse, setMustUse] = useState("");
  const [mustAvoid, setMustAvoid] = useState("");
  const [bannedClaims, setBannedClaims] = useState("");
  const [plan, setPlan] = useState("starter");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    Promise.all([fetch("/api/profile"), fetch("/api/auth/me")])
      .then(async ([profileRes, meRes]) => {
        const p = await profileRes.json();
        const me = await meRes.json();
        setMustUse((p.mustUse ?? []).join("\n"));
        setMustAvoid((p.mustAvoid ?? []).join("\n"));
        setBannedClaims((p.bannedClaims ?? []).join("\n"));
        if (me.plan) setPlan(me.plan === "demo" ? "team" : me.plan);
      })
      .catch(() => setError("Could not load rails."));
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    setStatus("");
    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mustUse, mustAvoid, bannedClaims }),
    });
    const data = await res.json().catch(() => ({}));
    setPending(false);
    if (!res.ok) {
      setError(data.error || "Save failed.");
      return;
    }
    setStatus("Rails saved. Later requests will load this profile.");
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
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Plan</legend>
          <div className="flex flex-wrap gap-2">
            {(["starter", "team", "desk"] as const).map((id) => (
              <button
                key={id}
                type="button"
                onClick={async () => {
                  const res = await fetch("/api/plan", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ plan: id }),
                  });
                  if (!res.ok) {
                    setError("Could not attach plan.");
                    return;
                  }
                  setPlan(id);
                  setStatus(`Attached the ${id} plan in demo mode.`);
                }}
                className={`h-10 rounded-[8px] px-4 text-sm ${
                  plan === id ? "bg-ink text-paper" : "border border-rule bg-raised"
                }`}
              >
                {id}
              </button>
            ))}
          </div>
        </fieldset>
        {error ? <p className="text-sm text-proof">{error}</p> : null}
        {status ? <p className="text-sm text-ink">{status}</p> : null}
        <button
          type="submit"
          disabled={pending}
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
