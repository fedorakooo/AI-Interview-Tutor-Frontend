import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const REFRESH_COOKIE = "ait_refresh";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/practice",
  "/interview",
  "/sessions",
  "/profile",
  "/onboarding",
  "/admin",
  "/tools",
  "/curriculum",
  "/settings",
];

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtectedPath(pathname)) {
    return NextResponse.next();
  }

  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refresh) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
