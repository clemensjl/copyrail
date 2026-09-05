import { randomUUID } from "node:crypto";
import { describe, expect, it } from "vitest";
import { createUser, getHistory, getProfile, getUserByEmail, getUserById, recordCheck, saveProfile } from "../src/lib/store";
import { database } from "../src/lib/db";
import { verifyPassword } from "../src/lib/auth";

describe.skipIf(process.env.RUN_DATABASE_TESTS !== "1")("real Postgres account persistence", () => {
  it("persists credentials, isolates accounts, and reads checks through independent SQL connections", async () => {
    const run = randomUUID();
    const ids: string[] = [];
    try {
      const a = await createUser({ email: `qa-a-${run}@copyrail.test`, password: "testing-strong-password", name: "Database test A" }); ids.push(a.id);
      const b = await createUser({ email: `qa-b-${run}@copyrail.test`, password: "testing-strong-password", name: "Database test B" }); ids.push(b.id);
      const loaded = await getUserByEmail(a.email.toUpperCase());
      expect(loaded?.id).toBe(a.id);
      expect(verifyPassword("testing-strong-password", loaded!.passwordHash)).toBe(true);
      expect((await getUserById(a.id))?.email).toBe(a.email);
      await expect(createUser({email:a.email,password:"testing-strong-password",name:"Duplicate"})).rejects.toThrow("already exists");
      await saveProfile(a.id, {mustUse:["Northstar"],mustAvoid:["synergy"],bannedClaims:["cures everything"]});
      expect((await getProfile(b.id)).mustUse).not.toContain("Northstar");
      const failed = await recordCheck(a.id, "Northstar synergy");
      const passed = await recordCheck(a.id, "Northstar helps writers review their work.");
      expect(failed.result.pass).toBe(false); expect(passed.result.pass).toBe(true);
      const rows = await database()`SELECT record FROM copyrail_checks WHERE user_id = ${a.id}`;
      expect(rows).toHaveLength(2);
      expect((await getHistory(a.id))[0].id).toBe(passed.id);
      expect(await getHistory(b.id)).toEqual([]);
      const profiles = await database()`SELECT profile FROM copyrail_profiles WHERE user_id = ${a.id}`;
      expect(profiles[0].profile.mustUse).toEqual(["Northstar"]);
    } finally {
      for (const id of ids) await database()`DELETE FROM copyrail_users WHERE id = ${id}`;
    }
  }, 60000);
});
