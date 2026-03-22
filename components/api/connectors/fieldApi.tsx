import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/components/api/api";
import { Field, FieldCreateRequest, FieldUpdateRequest, SportType } from "@/lib/types/field";

export const fetchFields = createAsyncThunk<
  Field[],
  { sport_type?: SportType; is_active?: boolean; sports_center_id?: string },
  { rejectValue: string }
>("fields/fetchFields", async (params, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.sport_type) queryParams.append("sport_type", params.sport_type);
    if (params.is_active !== undefined) queryParams.append("is_active", String(params.is_active));
    if (params.sports_center_id) queryParams.append("sports_center_id", params.sports_center_id);

    const response = await api.get<Field[]>(`/fields/?${queryParams.toString()}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || "Failed to fetch fields";
    return rejectWithValue(message);
  }
});

export const fetchFieldById = createAsyncThunk<
  Field,
  string,
  { rejectValue: string }
>("fields/fetchFieldById", async (fieldId, { rejectWithValue }) => {
  try {
    const response = await api.get<Field>(`/fields/${fieldId}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || "Failed to fetch field";
    return rejectWithValue(message);
  }
});

export const createField = createAsyncThunk<
  Field,
  FieldCreateRequest,
  { rejectValue: string }
>("fields/createField", async (fieldData, { rejectWithValue }) => {
  try {
    const response = await api.post<Field>("/fields/", fieldData);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || "Failed to create field";
    return rejectWithValue(message);
  }
});

export const updateField = createAsyncThunk<
  Field,
  { fieldId: string; fieldData: FieldUpdateRequest },
  { rejectValue: string }
>("fields/updateField", async ({ fieldId, fieldData }, { rejectWithValue }) => {
  try {
    const response = await api.put<Field>(`/fields/${fieldId}`, fieldData);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.detail || "Failed to update field";
    return rejectWithValue(message);
  }
});

export const deleteField = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("fields/deleteField", async (fieldId, { rejectWithValue }) => {
  try {
    await api.delete(`/fields/${fieldId}`);
    return fieldId;
  } catch (error: any) {
    const message = error.response?.data?.detail || "Failed to delete field";
    return rejectWithValue(message);
  }
});