import { env } from "@/lib/env";
import { tokenStore } from "@/lib/auth/token-store";

export class AppError extends Error {
  constructor(
    message: string,
    public status: number,
    public errorCode?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = tokenStore.getRefreshToken();
      if (!refreshToken) return null;

      const body = new URLSearchParams({ refresh_token: refreshToken });
      const res = await fetch(`${env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (!res.ok) return null;

      const data = (await res.json()) as {
        access_token: string;
        refresh_token: string;
      };
      tokenStore.setTokens(data.access_token, data.refresh_token);
      return data.access_token;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function parseError(status: number, body: unknown): AppError {
  if (body && typeof body === "object") {
    const obj = body as Record<string, unknown>;
    if (obj.detail && typeof obj.detail === "object") {
      const detail = obj.detail as { error_code?: string; message?: string };
      return new AppError(
        detail.message ?? "Request failed",
        status,
        detail.error_code,
      );
    }
    if (typeof obj.detail === "string") {
      return new AppError(obj.detail, status, obj.error_code as string | undefined);
    }
  }
  return new AppError("Request failed", status);
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean;
  form?: Record<string, string>;
  retry?: boolean;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { auth = true, body, form, retry = true, headers, ...init } = options;

  const reqHeaders = new Headers(headers);

  if (form) {
    reqHeaders.set("Content-Type", "application/x-www-form-urlencoded");
  } else if (body !== undefined && !(body instanceof FormData)) {
    reqHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = tokenStore.getAccessToken();
    if (token) reqHeaders.set("Authorization", `Bearer ${token}`);
  }

  let reqBody: BodyInit | undefined;
  if (form) {
    reqBody = new URLSearchParams(form);
  } else if (body instanceof FormData) {
    reqBody = body;
  } else if (body !== undefined) {
    reqBody = JSON.stringify(body);
  }

  const url = `${env.NEXT_PUBLIC_API_BASE_URL}${path}`;
  let response = await fetch(url, { ...init, headers: reqHeaders, body: reqBody });

  if (response.status === 401 && auth && retry) {
    const newToken = await refreshAccessToken();
    if (newToken) {
      reqHeaders.set("Authorization", `Bearer ${newToken}`);
      response = await fetch(url, { ...init, headers: reqHeaders, body: reqBody });
    }
  }

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw parseError(response.status, errBody);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
