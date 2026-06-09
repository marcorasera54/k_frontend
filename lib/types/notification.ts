export enum NotificationType {
  BOOKING_REMINDER = "booking_reminder",
  NEW_BOOKING_RECEIVED = "new_booking_received",
}

export interface Notification {
  _id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  booking_id?: string;
  created_at: string;
}