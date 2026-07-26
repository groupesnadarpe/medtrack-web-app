import { apiClient } from "@/core/api/http-client";
import type { ApiMutationResponse, PaginatedResponse, RepositoryRequestOptions, Uuid } from "@/core/api/api-types";
import type { AttendanceRecord, GuardRequest, Schedule } from "@/features/scheduling/domain/scheduling";

export const schedulingRepository = {
  listSchedules: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<Schedule>>("/scheduling/v1/schedules", options),

  getSchedule: (scheduleUuid: Uuid, options: RepositoryRequestOptions = {}) =>
    apiClient.get<Schedule>(`/scheduling/v1/schedules/${scheduleUuid}`, options),

  publishSchedule: (scheduleUuid: Uuid, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse>(`/scheduling/v1/schedules/${scheduleUuid}/publish`, {}, options),

  listGuardRequests: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<GuardRequest>>("/scheduling/v1/guard-requests", options),

  listAttendanceRecords: (options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<AttendanceRecord>>("/scheduling/v1/attendance-records", options),

  createAttendanceRecord: (payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse<AttendanceRecord>>("/scheduling/v1/attendance-records", payload, options),

  validateAttendanceRecord: (attendanceUuid: Uuid, payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse>(`/scheduling/v1/attendance-records/${attendanceUuid}/validate`, payload, options),
};