import { apiRequest } from "./client";
import type {
  PasswordResetTokenResponse,
  ResetPasswordRequest,
  TokenResponse,
  UserCreateRequest,
  UserResponse,
} from "@/lib/types/auth";

export const authApi = {
  signup(data: UserCreateRequest) {
    return apiRequest<UserResponse>("/api/v1/auth/signup", {
      method: "POST",
      body: data,
      auth: false,
    });
  },

  login(username: string, password: string) {
    return apiRequest<TokenResponse>("/api/v1/auth/token", {
      method: "POST",
      form: { username, password },
      auth: false,
      retry: false,
    });
  },

  refresh(refreshToken: string) {
    return apiRequest<TokenResponse>("/api/v1/auth/refresh", {
      method: "POST",
      form: { refresh_token: refreshToken },
      auth: false,
      retry: false,
    });
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
