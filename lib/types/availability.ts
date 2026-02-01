export enum DayOfWeek {
  MONDAY = "monday",
  TUESDAY = "tuesday",
  WEDNESDAY = "wednesday",
  THURSDAY = "thursday",
  FRIDAY = "friday",
  SATURDAY = "saturday",
  SUNDAY = "sunday",
}

export interface OperatingHours {
  start_time: string;
  end_time: string;
  slot_duration_minutes: number;
}

export interface Availability {
  _id: string;
  field_id: string;
  day_of_week: DayOfWeek;
  operating_hours: OperatingHours;
}

export interface AvailabilityCreateRequest {
  field_id: string;
  day_of_week: DayOfWeek;
  operating_hours: OperatingHours;
}

export interface AvailabilityUpdateRequest {
  day_of_week?: DayOfWeek;
  operating_hours?: OperatingHours;
}

export interface BlockedSlot {
  _id: string;
  field_id: string;
  blocked_date: string;
  start_time: string;
  end_time: string;
  reason?: string;
  created_at: string;
}

export interface BlockedSlotCreateRequest {
  field_id: string;
  blocked_date: string;
  start_time: string;
  end_time: string;
  reason?: string;
}

export interface AvailableSlot {
  start_time: string;
  end_time: string;
  price: number;
  is_available: boolean;
}