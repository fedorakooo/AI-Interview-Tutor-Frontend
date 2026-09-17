import { NextRequest, NextResponse } from "next/server";
import {
  accessResponse,
  backendError,
  refreshCookie,
  requestBackendToken,
} from "@/lib/auth/bff-server";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get(refreshCookie.name)?.value;
  if (!refreshToken) {
    return NextResponse.json({ detail: "Refresh session is missing" }, { status: 401 });
  }

  const { response, tokens } = await requestBackendToken("/api/v1/auth/refresh", {
    refresh_token: refreshToken,
  });
  if (!tokens) {
    const error = await backendError(response);
    error.cookies.set(refreshCookie.name, "", { ...refreshCookie.options, maxAge: 0 });
    return error;
  }
  return accessResponse(tokens);
}
