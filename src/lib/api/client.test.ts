import { describe, expect, it } from "vitest";
import { AppError, parseError } from "@/lib/api/client";

describe("parseError", () => {
  it("parses practice nested detail shape", () => {
    const error = parseError(400, {
      detail: { error_code: "PLAN_NOT_READY", message: "Plan is still generating" },
    });

    expect(error).toBeInstanceOf(AppError);
    expect(error.message).toBe("Plan is still generating");
    expect(error.status).toBe(400);
    expect(error.errorCode).toBe("PLAN_NOT_READY");
  });

  it("parses user-management string detail shape", () => {
    const error = parseError(403, {
      detail: "User is blocked",
      error_code: "BLOCKED",
    });

    expect(error.message).toBe("User is blocked");
    expect(error.status).toBe(403);
    expect(error.errorCode).toBe("BLOCKED");
  });

  it("returns generic message for unknown body", () => {
    const error = parseError(500, null);
    expect(error.message).toBe("Request failed");
    expect(error.status).toBe(500);
  });
});
