import { beforeAll, afterAll, afterEach, describe, expect, it } from "vitest";
import { server } from "@/mocks/handlers";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("auth and CV MSW handlers", () => {
  it("mocks login and CV status flow", async () => {
    const loginRes = await fetch("http://localhost/api/v1/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ username: "test", password: "pass" }),
    });

    expect(loginRes.ok).toBe(true);
    const tokens = await loginRes.json();
    expect(tokens.access_token).toBe("mock-access");

    const meRes = await fetch("http://localhost/api/v1/user/me/", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    expect(meRes.ok).toBe(true);
    const user = await meRes.json();
    expect(user.username).toBe("testuser01");

    const cvRes = await fetch("http://localhost/api/v1/user/me/cv/status");
    expect(cvRes.ok).toBe(true);
    const cvStatus = await cvRes.json();
    expect(cvStatus.status).toBe("completed");
  });
});
