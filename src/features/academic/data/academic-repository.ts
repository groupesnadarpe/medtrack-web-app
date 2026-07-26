import { apiClient } from "@/core/api/http-client";
import type { ApiMutationResponse, PaginatedResponse, RepositoryRequestOptions, Uuid } from "@/core/api/api-types";
import type { AcademicYear, Campaign, Enrollment, Program, Promotion, Student } from "@/features/academic/domain/academic";

export const academicRepository = {
  listStudents: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<Student>>("/academic/v1/students", options),

  createStudent: (payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse<Student>>("/academic/v1/students", payload, options),

  getStudent: (studentUuid: Uuid, options: RepositoryRequestOptions = {}) =>
    apiClient.get<Student>(`/academic/v1/students/${studentUuid}`, options),

  updateStudent: (studentUuid: Uuid, payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.patch<ApiMutationResponse<Student>>(`/academic/v1/students/${studentUuid}`, payload, options),

  linkStudentUser: (studentUuid: Uuid, payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse>(`/academic/v1/students/${studentUuid}/link-user`, payload, options),

  importPromotionStudents: (promotionUuid: Uuid, payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse>(`/academic/v1/promotions/${promotionUuid}/students/batch`, payload, options),

  listPrograms: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<Program>>("/academic/v1/programs", options),

  listAcademicYears: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<AcademicYear>>("/academic/v1/academic-years", options),

  listPromotions: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<Promotion>>("/academic/v1/promotions", options),

  listEnrollments: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<Enrollment>>("/academic/v1/enrollments", options),

  listCampaigns: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<Campaign>>("/academic/v1/campaigns", options),

  openCampaign: (campaignUuid: Uuid, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse>(`/academic/v1/campaigns/${campaignUuid}/open`, {}, options),

  closeCampaign: (campaignUuid: Uuid, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse>(`/academic/v1/campaigns/${campaignUuid}/close`, {}, options),
};