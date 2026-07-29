import { NextResponse } from "next/server";
import { getServerAuthSession } from "@/core/auth/auth-session";
import { authCookieName, refreshCookieName } from "@/core/auth/session-cookies";
import { logoutFromApi } from "@/features/auth/infrastructure/auth-gateway";

export async function POST() {
  const session = await getServerAuthSession();

  if (session) {
    try {
      await logoutFromApi(session.accessToken, session.refreshToken);
    } catch {
      // Même si l'API ne répond pas, on supprime la session locale pour protéger l'utilisateur.
    }
  }

  const response = NextResponse.json({ data: { message: "Déconnecté." } });
  response.cookies.delete(authCookieName);
  response.cookies.delete(refreshCookieName);

  return response;
}
