import Image from "next/image";
import Link from "next/link";

export function BrandMark({
  href = "/",
  size = 36,
}: {
  href?: string;
  size?: number;
}) {
  return (
    <Link href={href} className="inline-flex items-center gap-2.5 text-ink">
      <Image
        src="/logo.jpg"
        alt="Copyrail"
        width={size}
        height={size}
        className="rounded-[8px] object-cover"
        priority
      />
      <span className="font-display text-[17px] font-semibold tracking-tight">Copyrail</span>
    </Link>
  );
}
