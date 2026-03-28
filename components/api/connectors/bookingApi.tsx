import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/components/api/api";
import { Booking, BookingCreateRequest, BookingFilters, PaginatedBookingsResponse } from "@/lib/types/booking";

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
  PaginatedBookingsResponse,
  BookingFilters,
  { rejectValue: string }
>("bookings/fetchAllBookings", async (params, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams();
    if (params.field_id) query.set("field_id", params.field_id);
    if (params.status) query.set("status", params.status);
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", String(params.page));
    if (params.page_size) query.set("page_size", String(params.page_size));

    const response = await api.get<PaginatedBookingsResponse>(
      `/bookings/get-all-bookings?${query.toString()}`,
    );
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail || "Impossibile recuperare le prenotazioni";
    return rejectWithValue(message);
  }
});

export const createBooking = createAsyncThunk<
  Booking,
  BookingCreateRequest,
  { rejectValue: string }
>("bookings/createBooking", async (bookingData, { rejectWithValue }) => {
  try {
    const response = await api.post<Booking>("/bookings/create-booking", bookingData);
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

export const managerCancelBooking = createAsyncThunk<
  Booking,
  string,
  { rejectValue: string }
>("bookings/managerCancelBooking", async (bookingId, { rejectWithValue }) => {
  try {
    const response = await api.delete<Booking>(`/bookings/manage/${bookingId}`);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail || "Impossibile annullare la prenotazione";
    return rejectWithValue(message);
  }
});
