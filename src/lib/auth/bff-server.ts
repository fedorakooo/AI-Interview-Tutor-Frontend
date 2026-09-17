import { NextResponse } from "next/server";
import type { TokenResponse } from "@/lib/types/auth";

const REFRESH_COOKIE = "ait_refresh";

function backendUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not configured");
  return new URL(path, baseUrl).toString();
}

export const refreshCookie = {
  name: REFRESH_COOKIE,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  },
};

export async function requestBackendToken(
  path: string,
  fields: Record<string, string>,
): Promise<{ response: Response; tokens: TokenResponse | null }> {
  const response = await fetch(backendUrl(path), {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(fields),
    cache: "no-store",
  });
  const tokens = response.ok ? ((await response.json()) as TokenResponse) : null;
  return { response, tokens };
}

export async function backendError(response: Response): Promise<NextResponse> {
  const body = await response.json().catch(() => ({ detail: "Authentication request failed" }));
  return NextResponse.json(body, { status: response.status });
}

export function accessResponse(tokens: TokenResponse): NextResponse {
  const response = NextResponse.json({
    access_token: tokens.access_token,
    auth_type: tokens.auth_type,
  });
  response.cookies.set(refreshCookie.name, tokens.refresh_token, refreshCookie.options);
  return response;
}
