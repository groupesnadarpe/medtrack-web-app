import { apiRequest } from "@/core/api/http-client";
import type { NotificationItem, NotificationPreferences } from "@/features/notifications/domain/notification";

type BackendNotification = {
  uuid?: string;
  notification_uuid?: string;
  title?: string;
  body?: string;
  message?: string;
  read_at?: string | null;
  created_at?: string;
  type?: string;
  action_url?: string | null;
  [key: string]: unknown;
};

type NotificationListResponse = {
  data?: BackendNotification[];
  [key: string]: unknown;
};

function mapNotification(notification: BackendNotification): NotificationItem {
  return {
    uuid: notification.uuid ?? notification.notification_uuid ?? "",
    title: notification.title ?? "Notification",
    body: notification.body ?? notification.message ?? "",
    readAt: notification.read_at,
    createdAt: notification.created_at ?? new Date().toISOString(),
    type: notification.type,
    actionUrl: notification.action_url,
  };
}

export async function listNotificationsForUser(userUuid: string, token: string): Promise<NotificationItem[]> {
  const response = await apiRequest<NotificationListResponse>(`/notifications/v1/users/${userUuid}/notifications`, {
    token,
  });

  return (response.data ?? []).map(mapNotification).filter((notification) => notification.uuid.length > 0);
}

export async function markNotificationAsRead(notificationUuid: string, token: string): Promise<void> {
  await apiRequest(`/notifications/v1/notifications/${notificationUuid}/read`, {
    method: "PATCH",
    token,
    body: {},
  });
}

export async function markNotificationsAsRead(notificationUuids: string[], token: string): Promise<void> {
  await apiRequest("/notifications/v1/notifications/read-batch", {
    method: "POST",
    token,
    body: { notification_uuids: notificationUuids },
  });
}

export async function getNotificationPreferences(userUuid: string, token: string): Promise<NotificationPreferences> {
  const response = await apiRequest<{ data?: NotificationPreferences }>(`/notifications/v1/users/${userUuid}/notification-preferences`, {
    token,
  });

  return response.data ?? {};
}