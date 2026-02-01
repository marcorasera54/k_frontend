import { createSlice } from "@reduxjs/toolkit";
import {
  createAvailability,
  fetchFieldAvailability,
  updateAvailability,
  deleteAvailability,
  createBlockedSlot,
  fetchFieldBlockedSlots,
  deleteBlockedSlot,
  fetchAvailableSlots,
} from "@/components/api/connectors/availabilityApi";
import {
  Availability,
  BlockedSlot,
  AvailableSlot,
} from "@/lib/types/availability";

interface AvailabilityState {
  availabilities: Availability[];
  blockedSlots: BlockedSlot[];
  availableSlots: AvailableSlot[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AvailabilityState = {
  availabilities: [],
  blockedSlots: [],
  availableSlots: [],
  isLoading: false,
  error: null,
};

const availabilitySlice = createSlice({
  name: "availability",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAvailability.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAvailability.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availabilities.push(action.payload);
      })
      .addCase(createAvailability.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create availability";
      });

    builder
      .addCase(fetchFieldAvailability.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFieldAvailability.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availabilities = action.payload;
      })
      .addCase(fetchFieldAvailability.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch availability";
      });

    builder
      .addCase(updateAvailability.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAvailability.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.availabilities.findIndex(
          (a) => a._id === action.payload._id,
        );
        if (index !== -1) {
          state.availabilities[index] = action.payload;
        }
      })
      .addCase(updateAvailability.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update availability";
      });

    builder
      .addCase(deleteAvailability.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAvailability.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availabilities = state.availabilities.filter(
          (a) => a._id !== action.payload,
        );
      })
      .addCase(deleteAvailability.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete availability";
      });

    builder
      .addCase(createBlockedSlot.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBlockedSlot.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blockedSlots.push(action.payload);
      })
      .addCase(createBlockedSlot.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create blocked slot";
      });

    builder
      .addCase(fetchFieldBlockedSlots.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFieldBlockedSlots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blockedSlots = action.payload;
      })
      .addCase(fetchFieldBlockedSlots.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch blocked slots";
      });

    builder
      .addCase(deleteBlockedSlot.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteBlockedSlot.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blockedSlots = state.blockedSlots.filter(
          (b) => b._id !== action.payload,
        );
      })
      .addCase(deleteBlockedSlot.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to delete blocked slot";
      });

    builder
      .addCase(fetchAvailableSlots.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAvailableSlots.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableSlots = action.payload;
      })
      .addCase(fetchAvailableSlots.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch available slots";
      });
  },
});

export const { clearError } = availabilitySlice.actions;
export default availabilitySlice.reducer;
