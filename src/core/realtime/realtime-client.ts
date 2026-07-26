export type RealtimeSubscription = {
  unsubscribe: () => void;
};

export type RealtimeNotificationPayload = {
  notification_uuid?: string;
  title?: string;
  body?: string;
  [key: string]: unknown;
};

// Base volontairement mince pour Reverb/WebSocket.
// La connexion réelle sera ajoutée quand les clés publiques et le canal final seront figés.
export function subscribeToUserNotifications(
  userUuid: string,
  onNotification: (payload: RealtimeNotificationPayload) => void,
): RealtimeSubscription {
  void userUuid;
  void onNotification;

  return {
    unsubscribe: () => undefined,
  };
}