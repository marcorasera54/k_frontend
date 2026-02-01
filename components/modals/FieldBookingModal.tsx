"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createBooking } from "@/components/api/connectors/bookingApi";
import { fetchAvailableSlots } from "@/components/api/connectors/availabilityApi";
import { Field } from "@/lib/types/field";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";

interface FieldBookingModalProps {
  field: Field;
  isOpen: boolean;
  onClose: () => void;
}

export default function FieldBookingModal({
  field,
  isOpen,
  onClose,
}: FieldBookingModalProps) {
  const dispatch = useAppDispatch();
  const { availableSlots, isLoading } = useAppSelector(
    (state) => state.availability,
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [weekDates, setWeekDates] = useState<Date[]>([]);

  useEffect(() => {
    if (isOpen) {
      generateWeekDates();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && selectedDate) {
      const dateString = format(selectedDate, "yyyy-MM-dd");
      dispatch(fetchAvailableSlots({ fieldId: field._id, date: dateString }));
    }
  }, [isOpen, selectedDate, field._id, dispatch]);

  const generateWeekDates = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const dates = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    setWeekDates(dates);
  };

  const handleBooking = async () => {
    if (!selectedSlot) return;

    const startDateTime = new Date(selectedDate);
    const [startHour, startMinute] = selectedSlot.start_time.split(":");
    startDateTime.setHours(parseInt(startHour), parseInt(startMinute), 0, 0);

    const endDateTime = new Date(selectedDate);
    const [endHour, endMinute] = selectedSlot.end_time.split(":");
    endDateTime.setHours(parseInt(endHour), parseInt(endMinute), 0, 0);

    setIsSubmitting(true);
    try {
      await dispatch(
        createBooking({
          field_id: field._id,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
        }),
      ).unwrap();

      alert("Booking created successfully!");
      onClose();
    } catch (error: any) {
      alert(error || "Failed to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const availableSlotsForDate = availableSlots.filter(
    (slot) => slot.is_available,
  );
  const unavailableSlots = availableSlots.filter((slot) => !slot.is_available);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Book {field.name}
            </h2>
            <p className="text-gray-600 mt-1">
              {field.sport_type} - ${field.hourly_rate}/hour
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* Week Calendar */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Select Date
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((date) => {
                const isSelected = isSameDay(date, selectedDate);
                const isPast =
                  date < new Date() && !isSameDay(date, new Date());

                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => {
                      setSelectedDate(date);
                      setSelectedSlot(null);
                    }}
                    disabled={isPast}
                    className={`p-3 rounded-lg border-2 transition ${
                      isSelected
                        ? "border-blue-600 bg-blue-50"
                        : isPast
                        ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="text-xs text-gray-600">
                      {format(date, "EEE")}
                    </div>
                    <div className="text-lg font-semibold">
                      {format(date, "d")}
                    </div>
                    <div className="text-xs text-gray-500">
                      {format(date, "MMM")}
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => {
                  const newStart = addDays(weekDates[0], -7);
                  const newDates = Array.from({ length: 7 }, (_, i) =>
                    addDays(newStart, i),
                  );
                  setWeekDates(newDates);
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                ← Previous Week
              </button>
              <button
                onClick={() => {
                  const newStart = addDays(weekDates[0], 7);
                  const newDates = Array.from({ length: 7 }, (_, i) =>
                    addDays(newStart, i),
                  );
                  setWeekDates(newDates);
                }}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Next Week →
              </button>
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Available Time Slots - {format(selectedDate, "EEEE, MMMM d, yyyy")}
            </h3>
            {isLoading ? (
              <div className="text-center py-8 text-gray-600">
                Loading slots...
              </div>
            ) : availableSlotsForDate.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No available slots for this date</p>
                {unavailableSlots.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    {unavailableSlots.length} slots are already booked or blocked
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {availableSlotsForDate.map((slot, index) => {
                    const isSelected =
                      selectedSlot?.start_time === slot.start_time &&
                      selectedSlot?.end_time === slot.end_time;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-4 rounded-lg border-2 transition ${
                          isSelected
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <div className="font-semibold text-gray-900">
                          {slot.start_time} - {slot.end_time}
                        </div>
                        <div className="text-sm text-blue-600 mt-1 font-medium">
                          ${slot.price.toFixed(2)}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {unavailableSlots.length > 0 && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-600">
                      {unavailableSlots.length} unavailable slot(s) hidden
                      (already booked or blocked)
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between items-center sticky bottom-0 bg-white">
          <div className="text-sm text-gray-600">
            {selectedSlot && (
              <span>
                Selected: {selectedSlot.start_time} - {selectedSlot.end_time} (
                <span className="font-semibold text-blue-600">
                  ${selectedSlot.price.toFixed(2)}
                </span>
                )
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={!selectedSlot || isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}