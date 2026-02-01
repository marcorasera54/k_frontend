export enum SportType {
  FOOTBALL = "football",
  BASKETBALL = "basketball",
  TENNIS = "tennis",
  VOLLEYBALL = "volleyball",
  BADMINTON = "badminton",
}

export interface Field {
  _id: string;
  sports_center_id: string;
  name: string;
  sport_type: SportType;
  hourly_rate: number;
  description?: string;
  is_active: boolean;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
}

export interface FieldCreateRequest {
  sports_center_id: string;
  name: string;
  sport_type: SportType;
  hourly_rate: number;
  description?: string;
  is_active: boolean;
}

export interface FieldUpdateRequest {
  sports_center_id?: string;
  name?: string;
  sport_type?: SportType;
  hourly_rate?: number;
  description?: string;
  is_active?: boolean;
}