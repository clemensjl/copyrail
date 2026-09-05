import { describe, expect, it } from "vitest";
import { createSession, encodeToken, readSession, verifyPassword, hashPassword } from "../src/lib/auth";
describe("authentication boundaries", () => {
  it("rejects tampered, missing-expiry, expired and malformed sessions", () => {
    const token = createSession("user_a", "a@example.com");
    expect(readSession(token)?.userId).toBe("user_a");
    expect(readSession(token + "x")).toBeNull();
    expect(readSession(token + ".extra")).toBeNull();
    expect(readSession(encodeToken({userId:"user_a",email:"a@example.com"}))).toBeNull();
    expect(readSession(encodeToken({userId:"user_a",email:"a@example.com",exp:1}))).toBeNull();
  });
  it("salts passwords and rejects the wrong password", () => {
    const first=hashPassword("a strong test password");
    expect(first).not.toBe(hashPassword("a strong test password"));
    expect(verifyPassword("a strong test password",first)).toBe(true);
    expect(verifyPassword("wrong password",first)).toBe(false);
  });
});
