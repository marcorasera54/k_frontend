// File: components/api/connectors/profileApi.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/components/api/api";

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/profile/get-profile");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to fetch profile"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (data: UpdateProfilePayload, { rejectWithValue }) => {
    try {
      const response = await api.patch("/profile/update-profile", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to update profile"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "profile/changePassword",
  async (data: ChangePasswordPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("/profile/change-password", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to change password"
      );
    }
  }
);

export const deleteAccount = createAsyncThunk(
  "profile/deleteAccount",
  async (password: string, { rejectWithValue }) => {
    try {
      const response = await api.delete("/profile/delete-account", { data: { password } });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.detail || "Failed to delete account"
      );
    }
  }
);