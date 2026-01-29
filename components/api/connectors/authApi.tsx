import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginRequest, LoginResponse } from "@/lib/types/auth";
import api from "@/components/api/api";

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginRequest,
  { rejectValue: string }
>("auth/loginUser", async (loginData, { rejectWithValue }) => {
  try {
    const response = await api.post<LoginResponse>("/auth/login", loginData);

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || "Login failed";
    return rejectWithValue(message);
  }
});