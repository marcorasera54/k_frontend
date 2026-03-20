import { createSlice } from "@reduxjs/toolkit";
import { Booking } from "@/lib/types/booking";
import {
  fetchMyBookings,
  fetchAllBookings,
  createBooking,
  cancelBooking,
  managerCancelBooking,
} from "@/components/api/connectors/bookingApi";

interface BookingState {
  bookings: Booking[];
  pagination: {
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  pagination: { total: 0, page: 1, page_size: 10, total_pages: 0 },
  isLoading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch bookings";
      })
      .addCase(fetchAllBookings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings = action.payload.bookings;
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          page_size: action.payload.page_size,
          total_pages: action.payload.total_pages,
        };
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch bookings";
      })
      .addCase(createBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create booking";
      })
      .addCase(cancelBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bookings.findIndex(
          (b) => b._id === action.payload._id,
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to cancel booking";
      })
      .addCase(managerCancelBooking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(managerCancelBooking.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bookings.findIndex(
          (b) => b._id === action.payload._id,
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(managerCancelBooking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Impossibile annullare la prenotazione";
      });
  },
});

export const { clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
