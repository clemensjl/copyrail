import { describe, expect, it } from "vitest";
import { applyRails, checkCopy, PASS_THRESHOLD } from "../src/lib/brand-check";

describe("checkCopy (shipped brand-check)", () => {
  it("fails copy that contains a must-avoid term and locates it", () => {
    const copy = "Welcome to Acme, where synergy drives every launch.";
    const result = checkCopy(copy, {
      mustUse: ["Acme"],
      mustAvoid: ["synergy"],
      bannedClaims: [],
    });

    expect(result.valid).toBe(true);
    expect(result.pass).toBe(false);
    expect(result.score).toBeLessThan(PASS_THRESHOLD);

    const hit = result.violations.find((v) => v.type === "must-avoid");
    expect(hit).toBeDefined();
    expect(hit!.term.toLowerCase()).toBe("synergy");
    expect(hit!.location).toBeDefined();
    expect(copy.slice(hit!.location!.start, hit!.location!.end).toLowerCase()).toBe(
      "synergy",
    );
  });

  it("passes copy that uses required terms and avoids banned ones", () => {
    const copy =
      "Acme keeps patients first in every clinic note, with no inflated promises.";
    const result = checkCopy(copy, {
      mustUse: ["Acme", "patients first"],
      mustAvoid: ["synergy"],
      bannedClaims: ["guaranteed results"],
    });

    expect(result.valid).toBe(true);
    expect(result.pass).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(PASS_THRESHOLD);
    expect(result.violations.filter((v) => v.type !== "must-use")).toHaveLength(0);
  });

  it("rejects empty copy as invalid, not a pass", () => {
    const profile = {
      mustUse: ["Acme"],
      mustAvoid: ["synergy"],
      bannedClaims: [],
    };

    for (const copy of ["", "   ", "\n\t"]) {
      const result = checkCopy(copy, profile);
      expect(result.valid).toBe(false);
      expect(result.pass).toBe(false);
      expect(result.score).toBe(0);
      expect(result.violations.some((v) => v.type === "empty")).toBe(true);
    }
  });

  it("applyRails removes flagged phrases but leaves missing terms for human review", () => {
    const profile = {
      mustUse: ["Acme"],
      mustAvoid: ["synergy"],
      bannedClaims: ["guaranteed results"],
    };
    const applied = applyRails(
      "Welcome, where synergy and guaranteed results drive every launch.",
      profile,
    );
    expect(applied.copy.toLowerCase()).not.toContain("synergy");
    expect(applied.copy.toLowerCase()).not.toContain("guaranteed results");
    expect(applied.copy.toLowerCase()).not.toContain("acme");
    expect(applied.result.pass).toBe(false);
    expect(applied.result.valid).toBe(true);
    expect(applied.result.score).toBeGreaterThanOrEqual(PASS_THRESHOLD);
  });

  it("applyRails leaves empty copy invalid", () => {
    const applied = applyRails("", {
      mustUse: ["Acme"],
      mustAvoid: ["synergy"],
      bannedClaims: [],
    });
    expect(applied.result.valid).toBe(false);
    expect(applied.result.pass).toBe(false);
  });
});

it("holds a draft missing even one required phrase", () => {
  expect(checkCopy("A useful draft", {mustUse:["Acme"],mustAvoid:[],bannedClaims:[]}).pass).toBe(false);
});
it("matches whole words and preserves offsets after Unicode text", () => {
  const text = "Istanbul: the basket is safe. ASK us.";
  const result = checkCopy(text, {mustUse:[],mustAvoid:["ask"],bannedClaims:[]});
  expect(result.violations).toHaveLength(1);
  const location = result.violations[0].location!;
  expect(text.slice(location.start, location.end)).toBe("ASK");
});
it("does not damage words that contain a restricted substring", () => {
  const applied = applyRails("The basket is ready. Ask us.", {mustUse:[],mustAvoid:["ask"],bannedClaims:[]});
  expect(applied.copy).toContain("basket");
  expect(applied.copy).not.toContain("Ask");
});
