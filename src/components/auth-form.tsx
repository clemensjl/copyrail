"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Mode = "login" | "signup";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/app";
  const [email, setEmail] = useState(mode === "login" ? "demo@copyrail.app" : "");
  const [password, setPassword] = useState(mode === "login" ? "copyrail-demo" : "");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch(
        mode === "login" ? "/api/auth/login" : "/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            mode === "login" ? { email, password } : { email, password, name },
          ),
        },
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Request failed.");
        return;
      }
      router.push(next.startsWith("/") ? next : "/app");
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === "signup" ? (
        <label className="block text-xs font-medium uppercase tracking-wide text-mute">
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            className="mt-2 w-full border border-rule bg-white px-3 py-2 text-base outline-none focus:border-ink"
          />
        </label>
      ) : null}
      <label className="block text-xs font-medium uppercase tracking-wide text-mute">
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          className="mt-2 w-full border border-rule bg-white px-3 py-2 text-base outline-none focus:border-ink"
        />
      </label>
      <label className="block text-xs font-medium uppercase tracking-wide text-mute">
        Password
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={8}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className="mt-2 w-full border border-rule bg-white px-3 py-2 text-base outline-none focus:border-ink"
        />
      </label>
      {error ? (
        <p className="text-sm text-proof" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy}
        className="w-full bg-proof px-4 py-3 text-sm text-paper hover:bg-ink disabled:opacity-60"
      >
        {busy
          ? "Working..."
          : mode === "login"
            ? "Enter the desk"
            : "Create desk"}
      </button>
      <p className="text-sm text-mute">
        {mode === "login" ? (
          <>
            No desk yet?{" "}
            <Link href="/signup" className="text-ink underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already shipping?{" "}
            <Link href="/login" className="text-ink underline">
              Log in
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
