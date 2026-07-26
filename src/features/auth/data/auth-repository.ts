import { apiClient } from "@/core/api/http-client";
import type { ApiMutationResponse, RepositoryRequestOptions, Uuid } from "@/core/api/api-types";
import type { AuthUser, LoginCredentials, LoginResponse } from "@/features/auth/domain/auth";

export const authRepository = {
  // Connexion publique : aucune identité interne ne doit être ajoutée depuis le navigateur.
  login: (credentials: LoginCredentials) =>
    apiClient.post<LoginResponse>("/auth/v1/auth/login", credentials),

  refresh: (refreshToken: string) =>
    apiClient.post<LoginResponse>("/auth/v1/auth/refresh", { refresh_token: refreshToken }),

  me: (options: RepositoryRequestOptions) =>
    apiClient.get<AuthUser>("/auth/v1/auth/me", options),

  logout: (refreshToken: string | undefined, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse>("/auth/v1/auth/logout", { refresh_token: refreshToken }, options),

  requestPasswordReset: (login: string) =>
    apiClient.post<ApiMutationResponse>("/auth/v1/auth/password/forgot", { login }),

  resetPassword: (payload: Record<string, unknown>) =>
    apiClient.post<ApiMutationResponse>("/auth/v1/auth/password/reset", payload),

  changePassword: (payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.patch<ApiMutationResponse>("/auth/v1/auth/password", payload, options),

  listUsers: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<{ data: AuthUser[] }>("/auth/v1/users", options),

  updateUserStatus: (userUuid: Uuid, payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.patch<ApiMutationResponse>(`/auth/v1/users/${userUuid}/status`, payload, options),
};