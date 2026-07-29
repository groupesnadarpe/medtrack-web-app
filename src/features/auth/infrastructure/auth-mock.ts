/**
 * Adaptateur mock du service auth-v1.
 *
 * Il expose exactement la même signature que `auth-api.ts` : la gateway peut donc
 * basculer de l'un à l'autre sans qu'aucun écran ne change. Les erreurs sont levées
 * sous forme d'`ApiError` avec un problem-details identique à celui de l'API.
 */
import { ApiError } from "@/core/api/api-error";
import { actorsFromRoles } from "@/core/auth/role-access";
import type { AuthUser, LoginCredentials, LoginResult } from "@/features/auth/domain/auth-user";
import {
  findMockAccountByLogin,
  mockAccounts,
  type MockAuthUser,
} from "@/mocks/fixtures/auth-users";
import { mockLatency, mockRequestId } from "@/mocks/mock-runtime";

const MOCK_TOKEN_PREFIX = "mock.access.";
const MOCK_REFRESH_PREFIX = "mock.refresh.";

function unauthorized(detail: string): ApiError {
  return new ApiError(detail, 401, {
    type: "https://medtrack.cd/problems/invalid-credentials",
    title: "Authentification échouée",
    status: 401,
    code: "INVALID_CREDENTIALS",
    detail,
    request_id: mockRequestId(),
  });
}

function mapMockUser(user: MockAuthUser): AuthUser {
  return {
    uuid: user.uuid,
    displayName: user.display_name,
    email: user.email,
    phone: user.phone,
    roles: user.roles,
    actorAreas: actorsFromRoles(user.roles),
  };
}

export async function loginWithPassword(credentials: LoginCredentials): Promise<LoginResult> {
  await mockLatency();

  const account = findMockAccountByLogin(credentials.login);

  if (!account || account.password !== credentials.password) {
    throw unauthorized("Identifiant ou mot de passe incorrect.");
  }

  if (account.user.status !== "ACTIVE") {
    throw new ApiError("Compte inactif.", 403, {
      title: "Compte non actif",
      status: 403,
      code: "ACCOUNT_NOT_ACTIVE",
      detail: "Ce compte est suspendu. Contactez l'administrateur de votre établissement.",
      request_id: mockRequestId(),
    });
  }

  return {
    accessToken: `${MOCK_TOKEN_PREFIX}${account.user.uuid}`,
    refreshToken: `${MOCK_REFRESH_PREFIX}${account.user.uuid}`,
    user: mapMockUser(account.user),
  };
}

export async function getCurrentUser(accessToken: string): Promise<AuthUser> {
  await mockLatency(150);

  const uuid = accessToken.startsWith(MOCK_TOKEN_PREFIX)
    ? accessToken.slice(MOCK_TOKEN_PREFIX.length)
    : null;
  const account = uuid ? mockAccounts.find((item) => item.user.uuid === uuid) : null;

  if (!account) {
    throw unauthorized("Session expirée. Reconnectez-vous.");
  }

  return mapMockUser(account.user);
}

export async function logoutFromApi(): Promise<void> {
  await mockLatency(120);
}
