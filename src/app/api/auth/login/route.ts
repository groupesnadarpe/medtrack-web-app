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
    const defaultPath = defaultPathForRoles(result.user.roles);

    if (!defaultPath) {
      return NextResponse.json(
        {
          type: "https://medtrack.cd/problems/frontend-role-space",
          title: "Aucun espace utilisateur disponible",
          status: 403,
          code: "FRONTEND_ROLE_SPACE_UNAVAILABLE",
          detail: "Le compte est authentifié mais ne possède aucun rôle donnant accès à un espace Medtrack.",
        },
        { status: 403 },
      );
    }

    const requestedRedirect = request.nextUrl.searchParams.get("redirect");
    const redirectTo = safeRedirectPath(requestedRedirect, defaultPath);
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
