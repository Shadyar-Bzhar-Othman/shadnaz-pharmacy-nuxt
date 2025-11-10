export interface Notification {
  id: number;
  title: string;
  message: string;
  created_at?: string;
  updated_at?: string;
}

export interface NotificationForm {
  title: string;
  message: string;
}
