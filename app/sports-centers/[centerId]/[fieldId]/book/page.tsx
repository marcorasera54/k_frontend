"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
  Euro,
  AlertCircle,
  UserIcon,
  LogOut,
  Check,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFieldById } from "@/components/api/connectors/fieldApi";
import { fetchAvailableSlots } from "@/components/api/connectors/availabilityApi";
import { createBooking } from "@/components/api/connectors/bookingApi";
import { capitalize, getUserInitials } from "@/lib/utils";
import { SportType } from "@/lib/types/field";
import {
  format,
  addDays,
  startOfToday,
  startOfWeek,
  isSameDay,
  isToday,
  addWeeks,
  subWeeks,
} from "date-fns";
import { it } from "date-fns/locale";
import { cn } from "@/lib/utils";
import Image from "next/image";
import AppHeader from "@/components/layout/AppHeader";

export default function BookingPage() {
  const { user } = useAppSelector((state) => state.auth);
  const params = useParams();
  const fieldId = params.fieldId as string;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { selectedField, isLoading: fieldLoading } = useAppSelector(
    (state) => state.fields,
  );
  const { availableSlots, isLoading: slotsLoading } = useAppSelector(
    (state) => state.availability,
  );
  const { isLoading: bookingLoading, error: bookingError } = useAppSelector(
    (state) => state.bookings,
  );

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(startOfToday(), { weekStartsOn: 1 }),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const [selectedSlot, setSelectedSlot] = useState<{
    start_time: string;
    end_time: string;
    price: number;
  } | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showBookingPanel, setShowBookingPanel] = useState(false);

  const sportTypeLabels: Record<SportType, string> = {
    [SportType.FOOTBALL]: "Calcio",
    [SportType.PADEL]: "Padel",
    [SportType.TENNIS]: "Tennis",
    [SportType.BASKETBALL]: "Basket",
    [SportType.VOLLEYBALL]: "Pallavolo",
  };

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i),
  );

  useEffect(() => {
    if (fieldId) {
      dispatch(fetchFieldById(fieldId));
    }
  }, [dispatch, fieldId]);

  useEffect(() => {
    if (fieldId && selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      dispatch(fetchAvailableSlots({ fieldId, date: dateStr }));
      setSelectedSlot(null);
    }
  }, [dispatch, fieldId, selectedDate]);

  const handleBooking = async () => {
    if (!selectedSlot || !selectedDate) return;

    const startDateTime = `${format(selectedDate, "yyyy-MM-dd")}T${selectedSlot.start_time}`;
    const endDateTime = `${format(selectedDate, "yyyy-MM-dd")}T${selectedSlot.end_time}`;

    try {
      await dispatch(
        createBooking({
          field_id: fieldId,
          start_time: startDateTime,
          end_time: endDateTime,
        }),
      ).unwrap();

      setBookingSuccess(true);
      setSelectedSlot(null);
      setShowBookingPanel(false);

      const dateStr = format(selectedDate, "yyyy-MM-dd");
      dispatch(fetchAvailableSlots({ fieldId, date: dateStr }));

      setTimeout(() => {
        setBookingSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Booking failed:", error);
    }
  };

  const availableSlotsForDate = availableSlots.filter(
    (slot) => slot.is_available,
  );

  const handlePreviousWeek = () => {
    const newWeekStart = subWeeks(currentWeekStart, 1);
    if (newWeekStart >= startOfWeek(startOfToday(), { weekStartsOn: 1 })) {
      setCurrentWeekStart(newWeekStart);
      setSelectedDate(newWeekStart);
    }
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  if (fieldLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Caricamento campo...</p>
        </div>
      </div>
    );
  }

  if (!selectedField) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50 flex items-center justify-center p-4">
        <Card className="border-destructive max-w-md w-full">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive mb-4 text-center">
              Campo non trovato
            </p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Torna indietro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50/50">
      <AppHeader user={user} />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Success Alert */}
        {bookingSuccess && (
          <Alert className="mb-6 bg-emerald-50 border-emerald-200 animate-in slide-in-from-top">
            <Check className="h-4 w-4 text-emerald-600" />
            <AlertDescription className="text-emerald-800 font-medium">
              Prenotazione confermata con successo!
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {bookingError && (
          <Alert
            variant="destructive"
            className="mb-6 animate-in slide-in-from-top"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{bookingError}</AlertDescription>
          </Alert>
        )}

        {/* Field Info Card - Enhanced */}
        <Card className="border border-gray-100 bg-white rounded hover:border-gray-200 transition-all duration-300 p-0 overflow-hidden">
          <div className="relative h-40 sm:h-48 bg-gradient-to-br from-primary via-primary/90 to-primary/70">
            <Image
              src={
                selectedField.image_url ??
                "https://images.unsplash.com/photo-1601868071295-70ae1bf49090?q=80&w=1112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt={selectedField.name}
              width={400}
              height={160}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />{" "}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute top-4 right-4 flex gap-2">
              <Badge
                variant="secondary"
                className="bg-white/95 backdrop-blur-sm border-white/50 text-foreground font-medium shadow-lg"
              >
                {sportTypeLabels[selectedField.sport_type]}
              </Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1 drop-shadow-lg">
                {selectedField.name}
              </h1>
            </div>
          </div>
        </Card>

        {/* Weekly View Section */}
        <div className="py-3">
          <div className="grid lg:grid-cols-[380px,1fr] gap-6">
            {/* Left Column - Calendar */}
            <div className="space-y-4">
              <Card className="border border-gray-100 bg-white rounded hover:border-gray-200 transition-all duration-300 py-4 overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-base font-semibold">
                    Seleziona una data
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                  {/* Month Navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-md">
                      {format(currentWeekStart, "MMMM yyyy", { locale: it })
                        .charAt(0)
                        .toUpperCase() +
                        format(currentWeekStart, "MMMM yyyy", {
                          locale: it,
                        }).slice(1)}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePreviousWeek}
                        disabled={
                          currentWeekStart <=
                          startOfWeek(startOfToday(), { weekStartsOn: 1 })
                        }
                        className="h-8 w-8"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleNextWeek}
                        className="h-8 w-8"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Week Days Grid - Calendly Style */}
                  <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {/* Day Headers */}
                    {["L", "M", "M", "G", "V", "S", "D"].map((day, i) => (
                      <div
                        key={i}
                        className="text-center text-xs font-medium text-gray-500 pb-2"
                      >
                        {day}
                      </div>
                    ))}

                    {/* Day Buttons */}
                    {weekDays.map((day, index) => {
                      const isSelected = isSameDay(day, selectedDate);
                      const isTodayDay = isToday(day);
                      const isPast = day < startOfToday();

                      return (
                        <button
                          key={index}
                          onClick={() => !isPast && setSelectedDate(day)}
                          disabled={isPast}
                          className={cn(
                            "h-8 w-8 sm:h-14 sm:w-14 mx-auto flex items-center justify-center rounded-full text-sm font-medium transition-all relative cursor-pointer",
                            isSelected &&
                              "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
                            // Default
                            !isSelected &&
                              !isPast &&
                              "hover:bg-gray-100 text-gray-900",
                            // Past dates
                            isPast && "text-gray-300 cursor-not-allowed",
                            // Today
                            isTodayDay &&
                              !isSelected &&
                              "border-2 border-primary text-primary font-semibold",
                          )}
                        >
                          {format(day, "d")}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Time Slots & Summary */}
            <div className="space-y-6">
              {/* Selected Date Header */}
              <div className="lg:hidden">
                <h2 className="text-lg font-semibold mb-1">
                  {capitalize(
                    format(selectedDate, "EEEE, d MMMM", { locale: it }),
                  )}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Seleziona un orario disponibile
                </p>
              </div>

              <div className="hidden lg:block">
                <h2 className="text-xl font-semibold mb-2">
                  {capitalize(
                    format(selectedDate, "EEEE, d MMMM yyyy", { locale: it }),
                  )}
                </h2>
              </div>

              {/* Time Slots */}
              <div>
                {slotsLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Caricamento orari disponibili...
                    </p>
                  </div>
                ) : availableSlotsForDate.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                      <AlertCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="font-medium text-gray-900 mb-1">
                      Nessun orario disponibile
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Prova a selezionare un altro giorno
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {availableSlots.map((slot, index) => {
                      const isSelected =
                        selectedSlot?.start_time === slot.start_time &&
                        selectedSlot?.end_time === slot.end_time;
                      const isAvailable = slot.is_available;

                      return (
                        <div
                          key={index}
                          className={cn(
                            "border rounded transition-all duration-300 overflow-hidden",
                            isAvailable &&
                              !isSelected &&
                              "border-gray-200 bg-white hover:border-gray-300",
                            isAvailable &&
                              isSelected &&
                              "border-primary/30 bg-primary/5",
                            !isAvailable &&
                              "border-gray-100 bg-gray-50/50 opacity-70",
                          )}
                        >
                          {/* Slot Button */}
                          <button
                            onClick={() => {
                              if (isAvailable) {
                                setSelectedSlot({
                                  start_time: slot.start_time,
                                  end_time: slot.end_time,
                                  price: slot.price,
                                });
                                setShowBookingPanel(true);
                              }
                            }}
                            disabled={!isAvailable}
                            className={cn(
                              "w-full px-4 py-3 text-left flex items-center justify-between transition-colors",
                              isAvailable &&
                                "hover:bg-gray-50/50 cursor-pointer",
                              !isAvailable && "cursor-not-allowed",
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div>
                                <p
                                  className={cn(
                                    "font-semibold text-sm sm:text-base",
                                    isAvailable
                                      ? "text-gray-900"
                                      : "text-gray-400",
                                  )}
                                >
                                  {slot.start_time}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {slot.start_time} - {slot.end_time}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "font-bold text-sm sm:text-base",
                                  isAvailable
                                    ? "text-primary"
                                    : "text-gray-400",
                                )}
                              >
                                €{slot.price.toFixed(2)}
                              </span>
                            </div>
                          </button>

                          {/* Booking Confirmation Panel - Slides in smoothly */}
                          {showBookingPanel && isSelected && (
                            <div className="p-4">
                              {/* Action Buttons */}
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowBookingPanel(false);
                                    setSelectedSlot(null);
                                  }}
                                  className="h-8 rounded flex-1"
                                  disabled={bookingLoading}
                                >
                                  Annulla
                                </Button>

                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBooking();
                                  }}
                                  disabled={bookingLoading}
                                  className="h-8 rounded flex-1 bg-primary hover:bg-primary/90"
                                >
                                  {bookingLoading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Prenotazione...
                                    </>
                                  ) : (
                                    <>Prenota</>
                                  )}
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
