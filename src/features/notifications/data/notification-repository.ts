import { apiClient } from "@/core/api/http-client";
import type { ApiMutationResponse, PaginatedResponse, RepositoryRequestOptions, Uuid } from "@/core/api/api-types";
import type { Notification, NotificationPreference } from "@/features/notifications/domain/notification";

export const notificationRepository = {
  listForUser: (userUuid: Uuid, options: RepositoryRequestOptions = {}) =>
    apiClient.get<PaginatedResponse<Notification>>(`/notifications/v1/users/${userUuid}/notifications`, options),

  get: (notificationUuid: Uuid, options: RepositoryRequestOptions = {}) =>
    apiClient.get<Notification>(`/notifications/v1/notifications/${notificationUuid}`, options),

  markAsRead: (notificationUuid: Uuid, options: RepositoryRequestOptions) =>
    apiClient.patch<ApiMutationResponse>(`/notifications/v1/notifications/${notificationUuid}/read`, {}, options),

  markBatchAsRead: (notificationUuids: Uuid[], options: RepositoryRequestOptions) =>
    apiClient.post<ApiMutationResponse>("/notifications/v1/notifications/read-batch", { notification_uuids: notificationUuids }, options),

  getPreferences: (userUuid: Uuid, options: RepositoryRequestOptions = {}) =>
    apiClient.get<NotificationPreference>(`/notifications/v1/users/${userUuid}/notification-preferences`, options),

  updatePreferences: (userUuid: Uuid, payload: Record<string, unknown>, options: RepositoryRequestOptions) =>
    apiClient.put<ApiMutationResponse<NotificationPreference>>(`/notifications/v1/users/${userUuid}/notification-preferences`, payload, options),
};