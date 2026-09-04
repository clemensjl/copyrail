export const PASS_THRESHOLD = 80;

export type BrandProfile = {
  mustUse: string[];
  mustAvoid: string[];
  bannedClaims: string[];
};

export type ViolationType = "must-avoid" | "must-use" | "banned-claim" | "empty";

export type Violation = {
  type: ViolationType;
  term: string;
  location?: { start: number; end: number };
  suggestion: string;
};

export type CheckResult = {
  score: number;
  pass: boolean;
  passThreshold: number;
  violations: Violation[];
  valid: boolean;
};

export function normalizeList(input: string | string[] | undefined | null): string[] {
  if (input == null) return [];
  const raw = Array.isArray(input) ? input.join("\n") : String(input);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(/[\n,;]/)) {
    const term = part.trim();
    if (!term) continue;
    const key = term.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(term);
  }
  return out;
}

function findMatches(copy: string, term: string): { start: number; end: number }[] {
  const hits: { start: number; end: number }[] = [];
  if (!term) return hits;
  const hay = copy.toLowerCase();
  const needle = term.toLowerCase();
  let from = 0;
  while (from <= hay.length - needle.length) {
    const start = hay.indexOf(needle, from);
    if (start === -1) break;
    hits.push({ start, end: start + term.length });
    from = start + Math.max(needle.length, 1);
  }
  return hits;
}

export function checkCopy(copy: string, profile: BrandProfile): CheckResult {
  if (typeof copy !== "string" || copy.trim() === "") {
    return {
      score: 0,
      pass: false,
      passThreshold: PASS_THRESHOLD,
      valid: false,
      violations: [
        {
          type: "empty",
          term: "",
          suggestion: "Paste the copy you want to check before running the rail.",
        },
      ],
    };
  }

  const mustUse = normalizeList(profile.mustUse);
  const mustAvoid = normalizeList(profile.mustAvoid);
  const bannedClaims = normalizeList(profile.bannedClaims);
  const violations: Violation[] = [];
  let score = 100;

  for (const term of mustAvoid) {
    const hits = findMatches(copy, term);
    for (const location of hits) {
      violations.push({
        type: "must-avoid",
        term,
        location,
        suggestion: `Remove "${term}" or replace it with language from the brand list.`,
      });
      score -= 40;
    }
  }

  for (const term of bannedClaims) {
    const hits = findMatches(copy, term);
    for (const location of hits) {
      violations.push({
        type: "banned-claim",
        term,
        location,
        suggestion: `Drop the claim "${term}". Use a sourced, approved statement instead.`,
      });
      score -= 35;
    }
  }

  for (const term of mustUse) {
    if (findMatches(copy, term).length === 0) {
      violations.push({
        type: "must-use",
        term,
        suggestion: `Include the required term "${term}" so the copy stays on voice.`,
      });
      score -= 20;
    }
  }

  score = Math.max(0, Math.min(100, score));
  const blocking = violations.some(
    (v) => v.type === "must-avoid" || v.type === "banned-claim",
  );
  const valid = true;
  const pass = valid && score >= PASS_THRESHOLD && !blocking;

  return {
    score,
    pass,
    passThreshold: PASS_THRESHOLD,
    violations,
    valid,
  };
}
