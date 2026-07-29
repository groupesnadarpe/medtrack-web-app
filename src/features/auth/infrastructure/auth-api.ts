import { apiRequest } from "@/core/api/http-client";
import type { ApiEnvelope } from "@/shared/types/api";
import type { LoginCredentials, LoginResult } from "@/features/auth/domain/auth-user";

type AuthUserApi = {
  uuid?: string;
  public_id?: string;
  display_name?: string;
  fullname?: string | null;
  first_name?: string;
  last_name?: string;
  email?: string | null;
  phone?: string | null;
  phone_number?: string | null;
  account_type?: string | null;
  actor_areas?: LoginResult["user"]["actorAreas"];
};

type AuthRoleApi = {
  uuid?: string;
  code?: string | null;
  name?: string | null;
  status?: string | null;
};

type LoginApiResponse = ApiEnvelope<{
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  user: AuthUserApi;
}>;

type CurrentUserApiResponse = ApiEnvelope<{ user: AuthUserApi }>;
type AuthorizationApiResponse = ApiEnvelope<{
  user: AuthUserApi;
  roles: AuthRoleApi[];
  permissions: unknown[];
  scopes: unknown[];
}>;

// Auth-service sépare volontairement l'identité et les autorisations.
// Après Login ou /me, on charge donc les rôles avec le JWT avant toute décision de routage.
export async function loginWithPassword(credentials: LoginCredentials): Promise<LoginResult> {
  const response = await apiRequest<LoginApiResponse>("/auth/v1/auth/login", {
    method: "POST",
    body: credentials,
  });

  const user = await mapAuthorizedUser(response.data.user, response.data.access_token);

  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    user,
  };
}

export async function getCurrentUser(accessToken: string): Promise<LoginResult["user"]> {
  const response = await apiRequest<CurrentUserApiResponse>("/auth/v1/auth/me", {
    token: accessToken,
  });

  return mapAuthorizedUser(response.data.user, accessToken);
}

export async function logoutFromApi(accessToken: string, refreshToken?: string): Promise<void> {
  await apiRequest<ApiEnvelope<{ message?: string }>>("/auth/v1/auth/logout", {
    method: "POST",
    token: accessToken,
    body: refreshToken ? { refresh_token: refreshToken } : {},
  });
}

async function mapAuthorizedUser(user: AuthUserApi, accessToken: string): Promise<LoginResult["user"]> {
  const userUuid = user.uuid ?? user.public_id ?? "";

  if (!userUuid) {
    throw new Error("Auth-service n'a pas retourné l'UUID de l'utilisateur.");
  }

  const authorization = await apiRequest<AuthorizationApiResponse>(
    `/auth/v1/users/${userUuid}/authorizations`,
    { token: accessToken },
  );
  const roles = authorization.data.roles
    .filter((role) => !role.status || role.status === "ACTIVE")
    .map((role) => role.code)
    .filter((code): code is string => Boolean(code));

  return mapAuthUser(user, roles);
}

function mapAuthUser(user: AuthUserApi, roles: string[]): LoginResult["user"] {
  const fallbackName = [user.first_name, user.last_name].filter(Boolean).join(" ");

  return {
    uuid: user.uuid ?? user.public_id ?? "",
    displayName: user.display_name ?? user.fullname ?? (fallbackName || "Utilisateur Medtrack"),
    email: user.email,
    phone: user.phone_number ?? user.phone,
    roles: Array.from(new Set(roles)),
    actorAreas: user.actor_areas ?? [],
  };
}