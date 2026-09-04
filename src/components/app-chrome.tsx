"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClockCounterClockwise,
  SignOut,
  SlidersHorizontal,
  TextT,
} from "@phosphor-icons/react";

const links = [
  { href: "/app", label: "Checker", icon: TextT },
  { href: "/app/profile", label: "Rails", icon: SlidersHorizontal },
  { href: "/app/history", label: "History", icon: ClockCounterClockwise },
];

export function AppChrome({
  name,
  plan,
}: {
  name: string;
  plan: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <header className="border-b border-rule bg-paper">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link href="/app" className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="Copyrail"
            width={36}
            height={36}
            className="h-9 w-9 object-cover"
          />
          <span className="font-display text-lg tracking-tight">Copyrail</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm" aria-label="Desk">
          {links.map((link) => {
            const active =
              link.href === "/app"
                ? pathname === "/app"
                : pathname.startsWith(link.href);
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-3 py-2 ${
                  active ? "bg-ink text-paper" : "text-mute hover:text-ink"
                }`}
              >
                <Icon size={16} weight={active ? "fill" : "regular"} />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <p className="hidden text-right text-xs text-mute md:block">
            <span className="block text-ink">{name}</span>
            <span className="font-mono uppercase">{plan}</span>
          </p>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 px-2 py-2 text-sm text-mute hover:text-proof"
          >
            <SignOut size={16} />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
