import { apiClient } from "@/core/api/http-client";
import type { ApiMutationResponse, PaginatedResponse, RepositoryRequestOptions, Uuid } from "@/core/api/api-types";
import type { Internship, PathTemplate, Rotation } from "@/features/internships/domain/internship";

export const internshipRepository = {
  list: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<Internship>>("/internship/v1/internships", options),

  get: (internshipUuid: Uuid, options: RepositoryRequestOptions = {}) =>
    apiClient.get<Internship>(`/internship/v1/internships/${internshipUuid}`, options),

  transition: (internshipUuid: Uuid, action: "ready-to-start" | "start" | "suspend" | "resume" | "interrupt" | "complete" | "archive", payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse>(`/internship/v1/internships/${internshipUuid}/${action}`, payload, options),

  listRotations: (internshipUuid: Uuid, options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<Rotation>>(`/internship/v1/internships/${internshipUuid}/rotations`, options),

  generateRotations: (internshipUuid: Uuid, payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse>(`/internship/v1/internships/${internshipUuid}/rotations/generate`, payload, options),

  listPathTemplates: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<PathTemplate>>("/internship/v1/path-templates", options),
};