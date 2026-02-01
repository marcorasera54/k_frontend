export enum BookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
}

export interface Booking {
  _id: string;
  field_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface BookingCreateRequest {
  field_id: string;
  start_time: string;
  end_time: string;
}

export interface BookingWithDetails extends Booking {
  field_name?: string;
  sport_type?: string;
}