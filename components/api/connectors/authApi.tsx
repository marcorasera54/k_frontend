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
    console.log("Error: ", error);
    const message = error.response?.data?.detail || error;
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

export const forgotPassword = createAsyncThunk<
  { message: string },
  { email: string },
  { rejectValue: string }
>("auth/forgotPassword", async (emailData, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/forgot-password", emailData);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail || "Failed to send reset email";
    return rejectWithValue(message);
  }
});

export const verifyResetToken = createAsyncThunk<
  { message: string; valid: boolean },
  string,
  { rejectValue: string }
>("auth/verifyResetToken", async (token, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/verify-reset-token", { token });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || "Invalid reset token";
    return rejectWithValue(message);
  }
});

export const resetPassword = createAsyncThunk<
  { message: string },
  { token: string; new_password: string; confirm_password: string },
  { rejectValue: string }
>("auth/resetPassword", async (resetData, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/reset-password", resetData);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || "Password reset failed";
    return rejectWithValue(message);
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
    } catch (error: any) {
      const message = error.response?.data?.detail || "Logout failed";
      return rejectWithValue(message);
    }
  },
);

export const initiateGoogleLogin = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("auth/initiateGoogleLogin", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<{ url: string }>("/auth/google/url");
    window.location.href = response.data.url;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.detail || "Failed to get Google login URL",
    );
  }
});

export const googleCallback = createAsyncThunk<
  LoginResponse,
  string,
  { rejectValue: string }
>("auth/googleCallback", async (code, { rejectWithValue }) => {
  try {
    const response = await api.post<LoginResponse>("/auth/google/callback", {
      code,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.detail || "Google login failed",
    );
  }
});
