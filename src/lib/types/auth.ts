export type UserRole = "USER" | "ADMIN" | "MODERATOR";

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  auth_type: "BEARER";
}

export interface UserCreateRequest {
  first_name: string;
  second_name: string;
  username: string;
  phone_number: string;
  password: string;
  email: string;
}

export interface UserUpdateRequest {
  first_name?: string;
  second_name?: string;
  phone_number?: string;
  email?: string;
}

export interface UserResponse {
  id: string;
  first_name: string;
  second_name: string;
  username: string;
  phone_number: string;
  email: string;
  role: UserRole;
  created_at: string;
  modified_at: string;
}

export interface UsersResponse {
  users: UserResponse[];
  total: number;
}

export interface PasswordResetTokenResponse {
  password_reset_token: string;
}

export interface ResetPasswordRequest {
  new_password: string;
}

/** Decoded access token payload — decode only, never verify on client */
export interface AccessTokenClaims {
  id: string;
  username: string;
  role: UserRole;
  is_blocked: boolean;
  type: "ACCESS" | "REFRESH";
  exp: number;
  iat: number;
}
