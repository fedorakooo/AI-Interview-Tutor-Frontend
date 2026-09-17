import { describe, expect, it } from "vitest";
import { loginSchema, signupSchema } from "@/lib/validations/auth";

describe("signupSchema", () => {
  const validSignup = {
    first_name: "John",
    second_name: "Doe",
    username: "johndoe",
    phone_number: "+12345678901",
    password: "password1",
    email: "john@example.com",
  };

  it("accepts valid signup data", () => {
    expect(signupSchema.safeParse(validSignup).success).toBe(true);
  });

  it("rejects short username", () => {
    const result = signupSchema.safeParse({ ...validSignup, username: "ab" });
    expect(result.success).toBe(false);
  });

  it("rejects password without digit", () => {
    const result = signupSchema.safeParse({ ...validSignup, password: "password" });
    expect(result.success).toBe(false);
  });
});

describe("loginSchema", () => {
  it("requires username and password", () => {
    expect(loginSchema.safeParse({ username: "", password: "" }).success).toBe(false);
    expect(loginSchema.safeParse({ username: "user", password: "pass" }).success).toBe(true);
  });
});
