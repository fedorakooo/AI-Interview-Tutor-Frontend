import { NextRequest, NextResponse } from "next/server";
import { refreshCookie } from "@/lib/auth/bff-server";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(refreshCookie.name)?.value;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (refreshToken && baseUrl) {
    // Logout support is optional in older backend deployments. Local cookie cleanup
    // remains successful when this endpoint is unavailable.
    await fetch(new URL("/api/v1/auth/logout", baseUrl), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ refresh_token: refreshToken }),
      cache: "no-store",
    }).catch(() => undefined);
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(refreshCookie.name, "", { ...refreshCookie.options, maxAge: 0 });
  return response;
}
