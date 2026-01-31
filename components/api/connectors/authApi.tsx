import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginRequest, LoginResponse, User } from "@/lib/types/auth";
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

export const signupUser = createAsyncThunk<
  { message: string; user: User },
  { first_name: string; last_name: string; email: string; password: string },
  { rejectValue: string }
>("auth/signupUser", async (signupData, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/signup", signupData);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || "Signup failed";
    return rejectWithValue(message);
  }
});

export const verifyEmail = createAsyncThunk<
  { message: string; user: User; access_token?: string },
  string,
  { rejectValue: string }
>("auth/verifyEmail", async (token, { rejectWithValue }) => {
  try {
    const response = await api.get(`/auth/verify?token=${token}`);

    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || "Email verification failed";
    return rejectWithValue(message);
  }
});
