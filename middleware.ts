import { NextRequest, NextResponse } from "next/server";
import { protectedActorPaths } from "@/config/actors";
import { authCookieName } from "@/core/auth/session-cookies";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedArea = protectedActorPaths.some((path) => pathname === path || pathname.startsWith(`${path}/`));

  if (!isProtectedArea) {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has(authCookieName);

  if (hasSession) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("redirect", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/student/:path*",
    "/university/:path*",
    "/hospital/:path*",
    "/ordre-de-medecin/:path*",
    "/ministere/:path*",
    "/medtrack/:path*",
  ],
};