"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { BrandMark } from "@/components/brand-mark";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json().catch(() => ({}));
    setPending(false);
    if (!res.ok) {
      setError(data.error || "Could not create the account.");
      return;
    }
    router.push("/app");
    router.refresh();
    } catch { setError("Connection failed. Please try again."); }
    finally { setPending(false); }
  }

  return (
    <div className="min-h-[100dvh] bg-paper px-4 py-10">
      <div className="mx-auto max-w-md">
        <BrandMark />
        <h1 className="font-display mt-10 text-3xl font-semibold tracking-tight">Open the desk</h1>
        <p className="mt-2 text-sm text-mute">
          Create your free workspace. Use a password with at least 12 characters.
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 w-full rounded-[8px] border border-rule bg-raised px-3 text-ink"
            />
          </label>
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
              minLength={12} maxLength={128}
              className="h-11 w-full rounded-[8px] border border-rule bg-raised px-3 text-ink"
            />
          </label>
          {error ? <p className="text-sm text-proof">{error}</p> : null}
          <button
            type="submit"
            disabled={pending}
            className="h-11 w-full rounded-[8px] bg-proof text-sm font-medium text-proof-ink disabled:opacity-60"
          >
            {pending ? "Creating..." : "Create account"}
          </button>
        </form>
        <p className="mt-6 text-sm text-mute">
          Already on a desk?{" "}
          <Link href="/login" className="text-ink underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
