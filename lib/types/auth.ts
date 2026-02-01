export enum UserRole {
  USER = "user",
  FIELD_MANAGER = "field_manager",
  ADMIN = "administrator"
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_verified: boolean;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  token_type: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}