export enum NotificationType {
  BOOKING_CONFIRMED = "booking_confirmed",
  BOOKING_REMINDER = "booking_reminder",
  BOOKING_CANCELLED = "booking_cancelled",
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