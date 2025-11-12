import type { User } from "@/types/others/user";

export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_sends?: NotificationSend[];
  created_at?: string;
  updated_at?: string;
}

export interface NotificationForm {
  title: string;
  message: string;
}

export interface NotificationSend {
  id: number;
  notification_id: number;
  role: number;
  sender_id: number;
  sent_at: string;
  sender?: User;
  notification_users?: NotificationUser[];
  created_at?: string;
  updated_at?: string;
}

export interface NotificationSendForm {
  notification_id: number;
  role: number;
}

export interface NotificationUser {
  id: number;
  notification_send_id: number;
  user_id: number;
  is_read: number;
  read_at?: string;
  user?: User;
  created_at?: string;
  updated_at?: string;
}
