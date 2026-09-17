import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const mockUser = {
  id: "user-uuid",
  first_name: "Test",
  second_name: "User",
  username: "testuser01",
  phone_number: "+12345678901",
  email: "test@example.com",
  role: "USER",
  created_at: "2026-01-01T00:00:00Z",
  modified_at: "2026-01-01T00:00:00Z",
};

export const handlers = [
  http.post("*/api/v1/auth/token", () =>
    HttpResponse.json({
      access_token: "mock-access",
      refresh_token: "mock-refresh",
      auth_type: "BEARER",
    }),
  ),

  http.post("*/api/v1/auth/signup", () => HttpResponse.json(mockUser, { status: 201 })),

  http.get("*/api/v1/user/me/", () => HttpResponse.json(mockUser)),

  http.post("*/api/v1/user/me/cv/", () =>
    HttpResponse.json(
      {
        correlation_id: "cv-correlation-1",
        status: "pending",
        message: "Accepted",
      },
      { status: 202 },
    ),
  ),

  http.get("*/api/v1/user/me/cv/status", () =>
    HttpResponse.json({
      correlation_id: "cv-correlation-1",
      status: "completed",
      original_filename: "resume.pdf",
      error_code: null,
      error_message: null,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:01:00Z",
    }),
  ),
];

export const server = setupServer(...handlers);
