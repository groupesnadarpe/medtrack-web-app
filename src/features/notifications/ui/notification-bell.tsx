"use client";

import { useNotifications } from "@/features/notifications/application/use-notifications";
import { Badge } from "@/shared/ui/badge";

export function NotificationBell() {
  const { unreadCount, isLoading, error } = useNotifications();

  return (
    <button type="button" className="relative rounded-full border border-slate-200 px-3 py-2 text-sm" title={error ?? "Notifications"}>
      Notifications
      {!isLoading && unreadCount > 0 ? <Badge tone="danger" className="ml-2">{unreadCount}</Badge> : null}
    </button>
  );
}