import { decodeJwt } from "jose";
import type { AccessTokenClaims } from "@/lib/types/auth";

export function decodeAccessToken(token: string): AccessTokenClaims | null {
  try {
    return decodeJwt(token) as AccessTokenClaims;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, bufferSeconds = 30): boolean {
  const claims = decodeAccessToken(token);
  if (!claims?.exp) return true;
  return Date.now() >= (claims.exp - bufferSeconds) * 1000;
}
