import { cookies } from "next/headers";
import { authCookieName, refreshCookieName } from "@/core/auth/session-cookies";
import { defaultPathForRoles } from "@/core/auth/role-access";
import type { AuthUser } from "@/features/auth/domain/auth-user";
import { getCurrentUser } from "@/features/auth/infrastructure/auth-api";

export { authCookieName, refreshCookieName };

export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
};

export type CurrentSession = {
  status: "authenticated";
  auth: AuthSession;
  user: AuthUser;
  defaultPath: string | null;
};

// Lecture serveur uniquement : on évite localStorage pour limiter l'exposition du JWT.
export async function getServerAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(authCookieName)?.value;

  if (!accessToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken: cookieStore.get(refreshCookieName)?.value,
  };
}

export async function getCurrentSession(): Promise<CurrentSession | null> {
  const auth = await getServerAuthSession();

  if (!auth) {
    return null;
  }

  try {
    const user = await getCurrentUser(auth.accessToken);

    return {
      status: "authenticated",
      auth,
      user,
      defaultPath: defaultPathForRoles(user.roles),
    };
  } catch {
    // Le token existe mais n'est plus accepté par l'API.
    // Les routes serveur redirigeront vers login, et logout nettoiera les cookies.
    return null;
  }
}