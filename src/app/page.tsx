import Image from "next/image";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { LiveRail } from "@/components/live-rail";

export default function MarketingPage() {
  return (
    <div className="min-h-[100dvh] bg-paper text-ink">
      <header className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 md:px-8">
        <BrandMark />
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <a href="#rail" className="text-mute hover:text-ink">
            Product
          </a>
          <a href="#pricing" className="text-mute hover:text-ink">
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-sm text-mute hover:text-ink sm:inline">
            Sign in
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center rounded-[8px] bg-proof px-4 text-sm font-medium text-proof-ink transition-transform active:scale-[0.98]"
          >
            Open the desk
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 pt-10 pb-16 md:grid-cols-2 md:px-8 md:pt-16 lg:gap-16">
          <div>
            <h1 className="font-display max-w-[14ch] text-4xl font-semibold tracking-tight text-ink md:text-5xl lg:text-6xl leading-[1.1] pb-1">
              Keep AI copy on the brand rail.
            </h1>
            <p className="mt-5 max-w-[36ch] text-lg leading-7 text-mute">
              Score drafts against must-use terms, banned claims, and voice rules before they ship.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="inline-flex h-12 items-center rounded-[8px] bg-ink px-5 text-sm font-medium text-paper transition-transform active:scale-[0.98]"
              >
                Open the desk
              </Link>
              <Link
                href="/login"
                className="inline-flex h-12 items-center rounded-[8px] border border-rule bg-raised px-5 text-sm font-medium text-ink transition-transform active:scale-[0.98]"
              >
                Sign in
              </Link>
            </div>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-[8px]">
            <Image
              src="/hero.jpg"
              alt="Newsroom desk with marked-up copy, a red pencil, and a laptop draft"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              priority
            />
          </div>
        </section>

        <section id="rail" className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
          <h2 className="font-display max-w-[18ch] text-3xl font-semibold tracking-tight md:text-4xl">
            Run the same checker your desk will use.
          </h2>
          <p className="mt-3 max-w-[60ch] text-mute">
            Try a draft against example guidelines. Remove flagged language and see how the review changes.
          </p>
          <div className="mt-10">
            <LiveRail />
          </div>
        </section>

        <section className="relative mx-auto max-w-[1400px] px-4 md:px-8">
          <div className="relative aspect-[16/7] overflow-hidden rounded-[8px]">
            <Image
              src="/marks.jpg"
              alt="Proofread marketing paragraph with brick-red strikeouts and a steel ruler"
              fill
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Save rails. Run copy. Ship or fix.
          </h2>
          <div className="mt-10 grid gap-px bg-rule md:grid-cols-[1fr_2fr]">
            <div className="bg-paper p-6 md:p-8">
              <p className="font-mono text-sm text-proof">Save rails</p>
              <p className="mt-3 max-w-[36ch] text-mute">
                Keep separate required wording, restricted phrases, and prohibited claims for each client brand. Switch brands without mixing their guidelines.
              </p>
            </div>
            <div className="bg-paper p-6 md:p-8">
              <p className="font-mono text-sm text-proof">Run copy</p>
              <p className="mt-3 max-w-[52ch] text-mute">
                Review a draft, locate flagged phrases, and save the result. Each new report keeps the full draft and the exact guidelines used, ready to download or print.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-[1400px] items-center gap-10 px-4 pb-20 md:grid-cols-2 md:px-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[8px]">
            <Image
              src="/guidelines.jpg"
              alt="Open brand guidelines binder with a muted red tab beside a laptop"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Brand voice is a rule set, not a vibe.
            </h2>
            <p className="mt-4 max-w-[46ch] text-lg leading-7 text-mute">
              Check required wording and restricted phrases before sending a draft for review. Exact phrase checks support your reviewers; they do not replace legal review or assess the truth of a claim.
            </p>
          </div>
        </section>

        <section id="pricing" className="border-t border-rule bg-raised">
          <div className="mx-auto max-w-[1400px] px-4 py-20 md:px-8">
            <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Start with a clearer review process.
            </h2>
            <p className="mt-3 max-w-[54ch] text-mute">
              The free preview includes five private brand spaces and saved review reports. These are proposed subscription prices; payments and shared team access are not available yet.
            </p>
            <div className="mt-10 grid gap-4 lg:grid-cols-[0.8fr_1.2fr_0.8fr]">
              <PriceCol
                name="Starter"
                price="$49"
                note="Planned: one brand workspace and saved checks."
              />
              <PriceCol
                name="Team"
                price="$199"
                note="Planned: five brands, shared guidelines, and team review."
                featured
              />
              <PriceCol
                name="Desk"
                price="$499"
                note="Planned: organization-wide guidelines and review history."
              />
            </div>
          </div>
        </section>

        <section className="border-t border-rule">
          <div className="mx-auto max-w-[1400px] px-4 py-16 md:px-8">
            <h2 className="font-display max-w-[16ch] text-3xl font-semibold tracking-tight md:text-4xl">
              Put the next draft on the rail.
            </h2>
            <p className="mt-4 max-w-[46ch] text-sm text-mute">
              Create your own free workspace. No payment details required.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex h-12 items-center rounded-[8px] bg-proof px-5 text-sm font-medium text-proof-ink transition-transform active:scale-[0.98]"
            >
              Open the desk
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-8 text-sm text-mute md:flex-row md:items-center md:justify-between md:px-8">
        <BrandMark />
        <p>Brand-voice guardrails for AI writing teams. Copyrail, 2026.</p>
      </footer>
    </div>
  );
}

function PriceCol({
  name,
  price,
  note,
  featured = false,
}: {
  name: string;
  price: string;
  note: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`rounded-[8px] border p-6 ${
        featured ? "border-proof bg-paper md:p-8" : "border-rule bg-paper"
      }`}
    >
      <p className="text-sm text-mute">{name}</p>
      <p className="mt-3 font-mono text-4xl text-ink">
        {price}
        <span className="text-base text-mute">/mo</span>
      </p>
      <p className="mt-4 max-w-[32ch] text-sm leading-6 text-mute">{note}</p>
      <Link
        href="/signup"
        className={`mt-6 inline-flex h-10 items-center rounded-[8px] px-4 text-sm font-medium ${
          featured ? "bg-proof text-proof-ink" : "bg-ink text-paper"
        }`}
      >
        Open the desk
      </Link>
    </div>
  );
}
