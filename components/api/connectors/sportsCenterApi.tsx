import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/components/api/api";
import {
  SportsCenter,
  SportsCenterCreateRequest,
  SportsCenterUpdateRequest,
} from "@/lib/types/sports_center";

export const fetchSportsCenters = createAsyncThunk<
  SportsCenter[],
  { manager_id?: string; sport_type?: string; search?: string },
  { rejectValue: string }
>("sportsCenters/fetchSportsCenters", async (params, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.manager_id) queryParams.append("manager_id", params.manager_id);
    if (params.sport_type) queryParams.append("sport_type", params.sport_type);
    if (params.search) queryParams.append("search", params.search);

    const response = await api.get<SportsCenter[]>(
      `/sports-centers/?${queryParams.toString()}`
    );
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail || "Failed to fetch sports centers";
    return rejectWithValue(message);
  }
});

export const fetchMySportsCenters = createAsyncThunk<
  SportsCenter[],
  void,
  { rejectValue: string }
>("sportsCenters/fetchMySportsCenters", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<SportsCenter[]>("/sports-centers/my-centers");
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail || "Failed to fetch your sports centers";
    return rejectWithValue(message);
  }
});

export const fetchSportsCenterById = createAsyncThunk<
  SportsCenter,
  string,
  { rejectValue: string }
>("sportsCenters/fetchSportsCenterById", async (centerId, { rejectWithValue }) => {
  try {
    const response = await api.get<SportsCenter>(`/sports-centers/${centerId}`);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail || "Failed to fetch sports center";
    return rejectWithValue(message);
  }
});

export const createSportsCenter = createAsyncThunk<
  SportsCenter,
  SportsCenterCreateRequest,
  { rejectValue: string }
>("sportsCenters/createSportsCenter", async (centerData, { rejectWithValue }) => {
  try {
    const response = await api.post<SportsCenter>("/sports-centers", centerData);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.detail || "Failed to create sports center";
    return rejectWithValue(message);
  }
});

export const updateSportsCenter = createAsyncThunk<
  SportsCenter,
  { centerId: string; centerData: SportsCenterUpdateRequest },
  { rejectValue: string }
>(
  "sportsCenters/updateSportsCenter",
  async ({ centerId, centerData }, { rejectWithValue }) => {
    try {
      const response = await api.put<SportsCenter>(
        `/sports-centers/${centerId}`,
        centerData
      );
      return response.data;
    } catch (error: any) {
      const message =
        error.response?.data?.detail || "Failed to update sports center";
      return rejectWithValue(message);
    }
  }
);

export const deleteSportsCenter = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("sportsCenters/deleteSportsCenter", async (centerId, { rejectWithValue }) => {
  try {
    await api.delete(`/sports-centers/${centerId}`);
    return centerId;
  } catch (error: any) {
    const message =
      error.response?.data?.detail || "Failed to delete sports center";
    return rejectWithValue(message);
  }
});