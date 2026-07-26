import { apiClient } from "@/core/api/http-client";
import type { ApiMutationResponse, PaginatedResponse, RepositoryRequestOptions, Uuid } from "@/core/api/api-types";
import type { Institution, InstitutionAddress, InstitutionContact, InstitutionUnit } from "@/features/institutions/domain/institution";

export const institutionRepository = {
  list: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<Institution>>("/institution/v1/institutions", options),

  create: (payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse<Institution>>("/institution/v1/institutions", payload, options),

  get: (institutionUuid: Uuid, options: RepositoryRequestOptions = {}) =>
    apiClient.get<Institution>(`/institution/v1/institutions/${institutionUuid}`, options),

  update: (institutionUuid: Uuid, payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.patch<ApiMutationResponse<Institution>>(`/institution/v1/institutions/${institutionUuid}`, payload, options),

  verify: (institutionUuid: Uuid, payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.put<ApiMutationResponse>(`/institution/v1/institutions/${institutionUuid}/verification`, payload, options),

  listUnits: (institutionUuid: Uuid, options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<InstitutionUnit>>(`/institution/v1/institutions/${institutionUuid}/units`, options),

  listAddresses: (institutionUuid: Uuid, options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<InstitutionAddress>>(`/institution/v1/institutions/${institutionUuid}/addresses`, options),

  listContacts: (institutionUuid: Uuid, options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<InstitutionContact>>(`/institution/v1/institutions/${institutionUuid}/contacts`, options),
};