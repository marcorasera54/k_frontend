import { createSlice } from "@reduxjs/toolkit";
import { SportsCenter } from "@/lib/types/sports_center";
import {
  fetchSportsCenters,
  fetchMySportsCenters,
  fetchSportsCenterById,
  createSportsCenter,
  updateSportsCenter,
  deleteSportsCenter,
} from "@/components/api/connectors/sportsCenterApi";

interface SportsCenterState {
  sportsCenters: SportsCenter[];
  selectedSportsCenter: SportsCenter | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SportsCenterState = {
  sportsCenters: [],
  selectedSportsCenter: null,
  isLoading: false,
  error: null,
};

const sportsCenterSlice = createSlice({
  name: "sportsCenters",
  initialState,
  reducers: {
    clearSportsCenterError: (state) => {
      state.error = null;
    },
    clearSelectedSportsCenter: (state) => {
      state.selectedSportsCenter = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSportsCenters.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSportsCenters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sportsCenters = action.payload;
      })
      .addCase(fetchSportsCenters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch sports centers";
      })
      .addCase(fetchMySportsCenters.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMySportsCenters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sportsCenters = action.payload;
      })
      .addCase(fetchMySportsCenters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch your sports centers";
      })
      .addCase(fetchSportsCenterById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSportsCenterById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedSportsCenter = action.payload;
      })
      .addCase(fetchSportsCenterById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch sports center";
      })
      .addCase(createSportsCenter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createSportsCenter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sportsCenters.push(action.payload);
      })
      .addCase(createSportsCenter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create sports center";
      })
      .addCase(updateSportsCenter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSportsCenter.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.sportsCenters.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.sportsCenters[index] = action.payload;
        }
        if (state.selectedSportsCenter?._id === action.payload._id) {
          state.selectedSportsCenter = action.payload;
        }
      })
      .addCase(updateSportsCenter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update sports center";
      })
      .addCase(deleteSportsCenter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSportsCenter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sportsCenters = state.sportsCenters.filter(
          (c) => c._id !== action.payload
        );
        if (state.selectedSportsCenter?._id === action.payload) {
          state.selectedSportsCenter = null;
        }
      })
      .addCase(deleteSportsCenter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete sports center";
      });
  },
});

export const { clearSportsCenterError, clearSelectedSportsCenter } =
  sportsCenterSlice.actions;
export default sportsCenterSlice.reducer;