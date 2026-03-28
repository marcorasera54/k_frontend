import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/components/api/api";
import {
  Availability,
  AvailabilityCreateRequest,
  AvailabilityUpdateRequest,
  BlockedSlot,
  BlockedSlotCreateRequest,
  AvailableSlot,
} from "@/lib/types/availability";

export const createAvailability = createAsyncThunk<
  Availability,
  AvailabilityCreateRequest,
  { rejectValue: string }
>(
  "availability/createAvailability",
  async (availabilityData, { rejectWithValue }) => {
    try {
      const response = await api.post<Availability>(
        "/availability/create-availability",
        availabilityData,
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.detail || "Failed to create availability";
      return rejectWithValue(message);
    }
  },
);

export const fetchFieldAvailability = createAsyncThunk<
  Availability[],
  string,
  { rejectValue: string }
>(
  "availability/fetchFieldAvailability",
  async (fieldId, { rejectWithValue }) => {
    try {
      const response = await api.get<Availability[]>(
        `/availability/field/${fieldId}`,
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.detail || "Failed to fetch availability";
      return rejectWithValue(message);
    }
  },
);

export const updateAvailability = createAsyncThunk<
  Availability,
  { availabilityId: string; availabilityData: AvailabilityUpdateRequest },
  { rejectValue: string }
>(
  "availability/updateAvailability",
  async ({ availabilityId, availabilityData }, { rejectWithValue }) => {
    try {
      const response = await api.put<Availability>(
        `/availability/${availabilityId}`,
        availabilityData,
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.detail || "Failed to update availability";
      return rejectWithValue(message);
    }
  },
);

export const deleteAvailability = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "availability/deleteAvailability",
  async (availabilityId, { rejectWithValue }) => {
    try {
      await api.delete(`/availability/${availabilityId}`);
      return availabilityId;
    } catch (error: any) {
      const message =
        error.response?.data?.detail || "Failed to delete availability";
      return rejectWithValue(message);
    }
  },
);

export const createBlockedSlot = createAsyncThunk<
  BlockedSlot,
  BlockedSlotCreateRequest,
  { rejectValue: string }
>(
  "availability/createBlockedSlot",
  async (blockedSlotData, { rejectWithValue }) => {
    try {
      const response = await api.post<BlockedSlot>(
        "/availability/blocked-slots",
        blockedSlotData,
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.detail || "Failed to create blocked slot";
      return rejectWithValue(message);
    }
  },
);

export const fetchFieldBlockedSlots = createAsyncThunk<
  BlockedSlot[],
  string,
  { rejectValue: string }
>(
  "availability/fetchFieldBlockedSlots",
  async (fieldId, { rejectWithValue }) => {
    try {
      const response = await api.get<BlockedSlot[]>(
        `/availability/blocked-slots/field/${fieldId}`,
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.detail || "Failed to fetch blocked slots";
      return rejectWithValue(message);
    }
  },
);

export const deleteBlockedSlot = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "availability/deleteBlockedSlot",
  async (blockedSlotId, { rejectWithValue }) => {
    try {
      await api.delete(`/availability/blocked-slots/${blockedSlotId}`);
      return blockedSlotId;
    } catch (error: any) {
      const message =
        error.response?.data?.detail || "Failed to delete blocked slot";
      return rejectWithValue(message);
    }
  },
);

export const fetchAvailableSlots = createAsyncThunk<
  AvailableSlot[],
  { fieldId: string; date: string },
  { rejectValue: string }
>(
  "availability/fetchAvailableSlots",
  async ({ fieldId, date }, { rejectWithValue }) => {
    try {
      const response = await api.get<AvailableSlot[]>(
        `/availability/slots/field/${fieldId}?booking_date=${date}`,
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.detail || "Failed to fetch available slots";
      return rejectWithValue(message);
    }
  },
);