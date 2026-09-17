import { apiRequest, parseError } from "./client";
import type {
  PasswordResetTokenResponse,
  ResetPasswordRequest,
  TokenResponse,
  UserCreateRequest,
  UserResponse,
} from "@/lib/types/auth";

export type AccessTokenResponse = Pick<TokenResponse, "access_token" | "auth_type">;

async function bffRequest(path: string, body?: Record<string, string>): Promise<AccessTokenResponse> {
  const response = await fetch(path, {
    method: "POST",
    credentials: "same-origin",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw parseError(response.status, errBody);
  }

  return response.json() as Promise<AccessTokenResponse>;
}

export const authApi = {
  signup(data: UserCreateRequest) {
    return apiRequest<UserResponse>("/api/v1/auth/signup", {
      method: "POST",
      body: data,
      auth: false,
    });
  },

  login(username: string, password: string) {
    return bffRequest("/api/auth/login", { username, password });
  },

  refresh() {
    return bffRequest("/api/auth/refresh");
  },

  async logout() {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    } catch {
      // Cookie/session cleanup on the client still proceeds.
    }
  },

  requestPasswordReset(email: string) {
    return apiRequest<PasswordResetTokenResponse>("/api/v1/auth/reset-password", {
      method: "POST",
      form: { email },
      auth: false,
    });
  },

  confirmPasswordReset(token: string, data: ResetPasswordRequest) {
    return apiRequest<{ detail: string }>(`/api/v1/auth/reset-password/${token}`, {
      method: "POST",
      body: data,
      auth: false,
    });
  },
};

