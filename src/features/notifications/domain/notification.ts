export type NotificationItem = {
  uuid: string;
  title: string;
  body: string;
  readAt?: string | null;
  createdAt: string;
  type?: string;
  actionUrl?: string | null;
};

export type NotificationPreferences = {
  realtimeEnabled?: boolean;
  emailEnabled?: boolean;
  smsEnabled?: boolean;
};

// Alias de compatibilité pour les repositories génériques rapatriés.
export type Notification = NotificationItem;
export type NotificationPreference = NotificationPreferences;
