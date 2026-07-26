import { apiRequest } from "@/core/api/http-client";
import type { ApiEnvelope } from "@/shared/types/api";
import type { LoginCredentials, LoginResult } from "@/features/auth/domain/auth-user";

type AuthUserApi = {
  uuid?: string;
  public_id?: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string | null;
  phone?: string | null;
  roles?: string[];
  permissions?: string[];
  role_assignments?: Array<{
    role_code?: string;
    role?: string;
    scope_type?: string;
  }>;
  actor_areas?: LoginResult["user"]["actorAreas"];
};

type LoginApiResponse = ApiEnvelope<{
  access_token: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  user: AuthUserApi;
}>;

type CurrentUserApiResponse = ApiEnvelope<{
  user: AuthUserApi;
}>;

// Adaptateur API Auth : il isole le format Laravel/OpenAPI du modèle utilisé par l'interface.
export async function loginWithPassword(credentials: LoginCredentials): Promise<LoginResult> {
  const response = await apiRequest<LoginApiResponse>("/auth/v1/auth/login", {
    method: "POST",
    body: credentials,
  });

  return mapAuthSession(response.data);
}

export async function getCurrentUser(accessToken: string): Promise<LoginResult["user"]> {
  const response = await apiRequest<CurrentUserApiResponse>("/auth/v1/auth/me", {
    token: accessToken,
  });

  return mapAuthUser(response.data.user);
}

export async function logoutFromApi(accessToken: string, refreshToken?: string): Promise<void> {
  await apiRequest<ApiEnvelope<{ message?: string }>>("/auth/v1/auth/logout", {
    method: "POST",
    token: accessToken,
    body: refreshToken ? { refresh_token: refreshToken } : {},
  });
}

function mapAuthSession(data: LoginApiResponse["data"]): LoginResult {
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    user: mapAuthUser(data.user),
  };
}

function mapAuthUser(user: AuthUserApi): LoginResult["user"] {
  const assignmentRoles = (user.role_assignments ?? [])
    .map((assignment) => assignment.role_code ?? assignment.role)
    .filter((role): role is string => Boolean(role));

  const roles = Array.from(new Set([...(user.roles ?? []), ...assignmentRoles]));
  const fallbackName = [user.first_name, user.last_name].filter(Boolean).join(" ");

  return {
    uuid: user.uuid ?? user.public_id ?? "",
    displayName: user.display_name ?? (fallbackName || "Utilisateur Medtrack"),
    email: user.email,
    phone: user.phone,
    roles,
    actorAreas: user.actor_areas ?? [],
  };
}