import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/core/api/api-error";
import { authCookieName, refreshCookieName, sessionCookieOptions } from "@/core/auth/session-cookies";
import { defaultPathForRoles } from "@/core/auth/role-access";
import { safeRedirectPath } from "@/core/auth/redirects";
import { loginWithPassword } from "@/features/auth/infrastructure/auth-gateway";

export async function POST(request: NextRequest) {
  try {
    const credentials = await request.json();
    const result = await loginWithPassword(credentials);
    const requestedRedirect = request.nextUrl.searchParams.get("redirect");
    const redirectTo = safeRedirectPath(requestedRedirect, defaultPathForRoles(result.user.roles) ?? "/");
    const response = NextResponse.json({ data: { user: result.user, redirect_to: redirectTo } });

    // Cookies HttpOnly : le navigateur garde la session, mais le JS client ne lit jamais le JWT.
    response.cookies.set(authCookieName, result.accessToken, sessionCookieOptions.accessToken);

    if (result.refreshToken) {
      response.cookies.set(refreshCookieName, result.refreshToken, sessionCookieOptions.refreshToken);
    }

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(error.problem ?? { title: error.message, status: error.status }, { status: error.status });
    }

    return NextResponse.json({ title: "Erreur de connexion", status: 500 }, { status: 500 });
  }
}
