import type { Violation } from "@/lib/brand-check";

export function MarkedCopy({
  copy,
  violations,
}: {
  copy: string;
  violations: Violation[];
}) {
  const marks = violations
    .filter((v) => v.location)
    .sort((a, b) => a.location!.start - b.location!.start);

  const parts: { key: string; text: string; flagged: boolean }[] = [];
  let cursor = 0;
  for (const v of marks) {
    const start = v.location!.start;
    const end = v.location!.end;
    if (end <= cursor) continue;
    const from = Math.max(start, cursor);
    if (from > cursor) {
      parts.push({ key: `t-${cursor}`, text: copy.slice(cursor, from), flagged: false });
    }
    parts.push({ key: `f-${from}`, text: copy.slice(from, end), flagged: true });
    cursor = end;
  }
  if (cursor < copy.length) {
    parts.push({ key: "tail", text: copy.slice(cursor), flagged: false });
  }

  return (
    <p className="whitespace-pre-wrap rounded-[8px] border border-rule bg-paper px-4 py-3 leading-7">
      {parts.map((part) =>
        part.flagged ? (
          <mark key={part.key} className="rounded-[2px] bg-proof/15 text-proof">
            {part.text}
          </mark>
        ) : (
          <span key={part.key}>{part.text}</span>
        ),
      )}
    </p>
  );
}
