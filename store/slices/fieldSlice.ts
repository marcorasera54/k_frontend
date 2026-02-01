import { createSlice } from "@reduxjs/toolkit";
import { Field } from "@/lib/types/field";
import {
  fetchFields,
  fetchFieldById,
  createField,
  updateField,
  deleteField,
} from "@/components/api/connectors/fieldApi";

interface FieldState {
  fields: Field[];
  selectedField: Field | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: FieldState = {
  fields: [],
  selectedField: null,
  isLoading: false,
  error: null,
};

const fieldSlice = createSlice({
  name: "fields",
  initialState,
  reducers: {
    clearFieldError: (state) => {
      state.error = null;
    },
    clearSelectedField: (state) => {
      state.selectedField = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFields.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFields.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fields = action.payload;
      })
      .addCase(fetchFields.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch fields";
      })
      .addCase(fetchFieldById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFieldById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedField = action.payload;
      })
      .addCase(fetchFieldById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch field";
      })
      .addCase(createField.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createField.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fields.push(action.payload);
      })
      .addCase(createField.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create field";
      })
      .addCase(updateField.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateField.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.fields.findIndex((f) => f._id === action.payload._id);
        if (index !== -1) {
          state.fields[index] = action.payload;
        }
        if (state.selectedField?._id === action.payload._id) {
          state.selectedField = action.payload;
        }
      })
      .addCase(updateField.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update field";
      })
      .addCase(deleteField.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteField.fulfilled, (state, action) => {
        state.isLoading = false;
        state.fields = state.fields.filter((f) => f._id !== action.payload);
        if (state.selectedField?._id === action.payload) {
          state.selectedField = null;
        }
      })
      .addCase(deleteField.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete field";
      });
  },
});

export const { clearFieldError, clearSelectedField } = fieldSlice.actions;
export default fieldSlice.reducer;