/**
 * Gateway d'authentification : point d'entrée unique des routes serveur.
 *
 * Tout le reste de l'application importe UNIQUEMENT ce module, jamais `auth-api`
 * ni `auth-mock` directement. Basculer sur le vrai back-end se résume donc à poser
 * NEXT_PUBLIC_USE_MOCKS=false.
 */
import { env } from "@/config/env";
import type { AuthUser, LoginCredentials, LoginResult } from "@/features/auth/domain/auth-user";
import * as authApi from "@/features/auth/infrastructure/auth-api";
import * as authMock from "@/features/auth/infrastructure/auth-mock";

const adapter = env.useMocks ? authMock : authApi;

export function loginWithPassword(credentials: LoginCredentials): Promise<LoginResult> {
  return adapter.loginWithPassword(credentials);
}

export function getCurrentUser(accessToken: string): Promise<AuthUser> {
  return adapter.getCurrentUser(accessToken);
}

export function logoutFromApi(accessToken: string, refreshToken?: string): Promise<void> {
  return adapter.logoutFromApi(accessToken, refreshToken);
}
