import { apiRequest } from "./client";

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  created_at: string;
  read: boolean;
  kind: string;
}

export const notificationsApi = {
  list: () => apiRequest<NotificationItem[]>("/api/v1/notifications"),

  markRead: (notificationId: string) =>
    apiRequest<{ detail: string }>(`/api/v1/notifications/mark-read/${notificationId}`, {
      method: "POST",
    }),
};
