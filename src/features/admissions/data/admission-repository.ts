import { apiClient } from "@/core/api/http-client";
import type { ApiMutationResponse, PaginatedResponse, RepositoryRequestOptions, Uuid } from "@/core/api/api-types";
import type { AdmissionApplication, CapacityPool, InternshipCase } from "@/features/admissions/domain/admission";

export const admissionRepository = {
  listCases: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<InternshipCase>>("/admission/v1/internship-cases", options),

  createCase: (payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse<InternshipCase>>("/admission/v1/internship-cases", payload, options),

  getCase: (caseUuid: Uuid, options: RepositoryRequestOptions = {}) =>
    apiClient.get<InternshipCase>(`/admission/v1/internship-cases/${caseUuid}`, options),

  listApplications: (caseUuid: Uuid, options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<AdmissionApplication>>(`/admission/v1/internship-cases/${caseUuid}/applications`, options),

  submitApplication: (applicationUuid: Uuid, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse>(`/admission/v1/applications/${applicationUuid}/submit`, {}, options),

  acceptApplication: (applicationUuid: Uuid, payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse>(`/admission/v1/applications/${applicationUuid}/accept`, payload, options),

  rejectApplication: (applicationUuid: Uuid, payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse>(`/admission/v1/applications/${applicationUuid}/reject`, payload, options),

  listCapacityPools: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<CapacityPool>>("/admission/v1/capacity-pools", options),
};