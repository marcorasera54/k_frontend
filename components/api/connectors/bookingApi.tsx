import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/components/api/api";
import { Booking, BookingCreateRequest } from "@/lib/types/booking";

export const fetchMyBookings = createAsyncThunk<
  Booking[],
  void,
  { rejectValue: string }
>("bookings/fetchMyBookings", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<Booking[]>("/bookings/my-bookings");
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || "Failed to fetch bookings";
    return rejectWithValue(message);
  }
});

export const fetchAllBookings = createAsyncThunk<
  Booking[],
  { field_id?: string },
  { rejectValue: string }
>("bookings/fetchAllBookings", async (params, { rejectWithValue }) => {
  try {
    const queryParams = params.field_id ? `?field_id=${params.field_id}` : "";
    const response = await api.get<Booking[]>(`/bookings${queryParams}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || "Failed to fetch bookings";
    return rejectWithValue(message);
  }
});

export const createBooking = createAsyncThunk<
  Booking,
  BookingCreateRequest,
  { rejectValue: string }
>("bookings/createBooking", async (bookingData, { rejectWithValue }) => {
  try {
    const response = await api.post<Booking>("/bookings", bookingData);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || "Failed to create booking";
    return rejectWithValue(message);
  }
});

export const cancelBooking = createAsyncThunk<
  Booking,
  string,
  { rejectValue: string }
>("bookings/cancelBooking", async (bookingId, { rejectWithValue }) => {
  try {
    const response = await api.delete<Booking>(`/bookings/${bookingId}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || "Failed to cancel booking";
    return rejectWithValue(message);
  }
});