import { describe, expect, it, beforeEach } from "vitest";
import {
  applyAndRecord,
  createUser,
  getHistory,
  getProfile,
  recordCheck,
  resetStore,
  saveProfile,
  setPlan,
} from "../src/lib/store";

describe("account persistence round-trip", () => {
  beforeEach(() => {
    resetStore();
  });

  it("saves a brand profile, scores copy, and reads both back", () => {
    const user = createUser({
      email: `desk-${Date.now()}@copyrail.test`,
      password: "rail-test-pass",
      name: "Desk test",
    });

    const saved = saveProfile(user.id, {
      mustUse: ["Northstar"],
      mustAvoid: ["synergy"],
      bannedClaims: ["cures everything"],
    });
    expect(getProfile(user.id)).toEqual(saved);

    const failing = recordCheck(user.id, "Northstar synergy will change your week.");
    expect(failing.result.pass).toBe(false);
    expect(
      failing.result.violations.some((v) => v.term.toLowerCase() === "synergy"),
    ).toBe(true);

    const passing = recordCheck(
      user.id,
      "Northstar clinics keep the notes plain and specific.",
    );
    expect(passing.result.pass).toBe(true);

    const history = getHistory(user.id);
    expect(history[0]?.id).toBe(passing.id);
    expect(history.some((row) => row.id === failing.id)).toBe(true);
    expect(getProfile(user.id).mustAvoid).toContain("synergy");

    const applied = applyAndRecord(user.id, "Northstar synergy will change your week.");
    expect(applied.copy.toLowerCase()).not.toContain("synergy");
    expect(applied.record.result.pass).toBe(true);
    expect(setPlan(user.id, "team").plan).toBe("team");
  });
});
