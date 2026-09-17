import { NextRequest } from "next/server";
import { accessResponse, backendError, requestBackendToken } from "@/lib/auth/bff-server";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;
  if (!body?.username || !body.password) {
    return Response.json({ detail: "Username and password are required" }, { status: 400 });
  }

  const { response, tokens } = await requestBackendToken("/api/v1/auth/token", {
    username: body.username,
    password: body.password,
  });
  if (!tokens) return backendError(response);
  return accessResponse(tokens);
}
