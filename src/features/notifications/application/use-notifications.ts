"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { NotificationItem } from "@/features/notifications/domain/notification";

type ClientNotificationResponse = {
  data: NotificationItem[];
  degraded?: boolean;
  message?: string;
  request_id?: string | null;
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/notifications", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Impossible de charger les notifications.");
      }

      const payload = (await response.json()) as ClientNotificationResponse;
      setNotifications(payload.data);

      if (payload.degraded) {
        const requestReference = payload.request_id ? ` Référence : ${payload.request_id}.` : "";
        setError(`${payload.message ?? "Notifications indisponibles."}${requestReference}`);
      }
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "Erreur inconnue.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationUuid: string) => {
    await fetch(`/api/notifications/${notificationUuid}/read`, {
      method: "PATCH",
      headers: { Accept: "application/json" },
    });

    setNotifications((current) =>
      current.map((notification) =>
        notification.uuid === notificationUuid ? { ...notification, readAt: notification.readAt ?? new Date().toISOString() } : notification,
      ),
    );
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [refresh]);

  return useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((notification) => !notification.readAt).length,
      isLoading,
      error,
      refresh,
      markAsRead,
    }),
    [error, isLoading, markAsRead, notifications, refresh],
  );
}