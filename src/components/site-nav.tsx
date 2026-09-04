import Link from "next/link";

export function SiteNav({ solid = false }: { solid?: boolean }) {
  return (
    <header
      className={`flex items-center justify-between gap-6 px-5 py-4 md:px-10 ${
        solid ? "border-b border-rule bg-paper" : ""
      }`}
    >
      <Link href="/" className="flex items-center gap-3">
        <img
          src="/logo.jpg"
          alt="Copyrail"
          width={40}
          height={40}
          className="h-10 w-10 object-cover"
        />
        <span className="font-display text-xl tracking-tight">Copyrail</span>
      </Link>
      <nav className="flex items-center gap-3 text-sm md:gap-5">
        <Link href="/login" className="text-mute hover:text-ink">
          Log in
        </Link>
        <Link
          href="/signup"
          className="bg-ink px-3 py-2 text-paper hover:bg-proof"
        >
          Open a desk
        </Link>
      </nav>
    </header>
  );
}
