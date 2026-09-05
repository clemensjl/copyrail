import Link from "next/link";
import { redirect } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { currentUser } from "@/lib/request-auth";
import { LogoutButton } from "@/components/logout-button";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <header className="border-b border-rule">
        <div className="mx-auto flex min-h-16 max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-8">
          <BrandMark href="/app" />
          <nav className="flex w-full items-center justify-between gap-4 text-sm sm:w-auto">
            <Link href="/app" className="text-mute hover:text-ink">
              Checker
            </Link>
            <Link href="/app/profile" className="text-mute hover:text-ink">
              Rails
            </Link>
            <Link href="/app/history" className="text-mute hover:text-ink">
              History
            </Link>
            <span className="hidden text-mute sm:inline">{user.email}</span>
            <LogoutButton />
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-8">{children}</div>
    </div>
  );
}
