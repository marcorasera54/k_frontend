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
  user_first_name?: string;
  user_last_name?: string;
  user_email?: string;
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

export interface BookingWithFieldInfo extends Booking {
  field_name?: string;
  sport_type?: string;
  sports_center_name?: string;
}

export interface PaginatedBookingsResponse {
  bookings: Booking[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface BookingFilters {
  field_id?: string;
  status?: string;
  search?: string;
  page?: number;
  page_size?: number;
}