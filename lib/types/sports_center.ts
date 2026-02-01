export enum SportsCenterStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  MAINTENANCE = "maintenance",
}

export interface ContactInfo {
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
}

export interface SportsCenter {
  _id: string;
  name: string;
  description?: string;
  logo_url?: string;
  contact_info?: ContactInfo;
  status: SportsCenterStatus;
  manager_id: string;
  created_at: string;
  updated_at: string;
}

export interface SportsCenterCreateRequest {
  name: string;
  description?: string;
  logo_url?: string;
  contact_info?: ContactInfo;
  status: SportsCenterStatus;
}

export interface SportsCenterUpdateRequest {
  name?: string;
  description?: string;
  logo_url?: string;
  contact_info?: ContactInfo;
  status?: SportsCenterStatus;
}