"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { BrandMark } from "@/components/brand-mark";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@copyrail.app");
  const [password, setPassword] = useState("copyrail-demo");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    setPending(false);
    if (!res.ok) {
      setError(data.error || "Could not sign in.");
      return;
    }
    router.push("/app");
    router.refresh();
  }

  return (
    <div className="min-h-[100dvh] bg-paper px-4 py-10">
      <div className="mx-auto max-w-md">
        <BrandMark />
        <h1 className="font-display mt-10 text-3xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-mute">
          Seeded desk: demo@copyrail.app / copyrail-demo
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 w-full rounded-[8px] border border-rule bg-raised px-3 text-ink"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 w-full rounded-[8px] border border-rule bg-raised px-3 text-ink"
            />
          </label>
          {error ? <p className="text-sm text-proof">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="h-11 w-full rounded-[8px] bg-proof text-sm font-medium text-proof-ink disabled:opacity-60"
          >
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-sm text-mute">
          No account?{" "}
          <Link href="/signup" className="text-ink underline">
            Open the desk
          </Link>
        </p>
      </div>
    </div>
  );
}
