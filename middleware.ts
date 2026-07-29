import { NextRequest, NextResponse } from "next/server";
import { protectedActorPaths } from "@/config/actors";
import { authCookieName } from "@/core/auth/session-cookies";
import { routes } from "@/core/routing/routes";

// Première barrière côté interface : toute zone acteur exige un cookie de session.
// L'autorisation métier reste ensuite vérifiée côté page, API, Kong et service Laravel.
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedArea = protectedActorPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!isProtectedArea || request.cookies.has(authCookieName)) {
    return NextResponse.next();
  }

  const loginUrl = new URL(routes.login, request.url);
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