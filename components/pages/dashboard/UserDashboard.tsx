"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMyBookings,
  cancelBooking,
} from "@/components/api/connectors/bookingApi";
import { fetchFields } from "@/components/api/connectors/fieldApi";
import { BookingStatus } from "@/lib/types/booking";
import { User } from "@/lib/types/auth";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Loader2,
  Calendar,
  MapPin,
  DollarSign,
  User as UserIcon,
  LogOut,
  Settings,
  CalendarIcon,
  Calendar1Icon,
  Clock,
  Euro,
  X,
  Check,
  EuroIcon,
} from "lucide-react";
import { capitalize, cn, getUserInitials } from "@/lib/utils";
import Image from "next/image";
import { it } from "date-fns/locale";
import AppHeader from "@/components/layout/AppHeader";
import { setToast, TOAST_TYPE } from "@/components/ui/toast";

interface UserDashboardProps {
  user: User;
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { bookings, isLoading: bookingsLoading } = useAppSelector(
    (state) => state.bookings,
  );
  const { fields } = useAppSelector((state) => state.fields);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchMyBookings());
    dispatch(fetchFields({ is_active: true }));
  }, [dispatch]);

  const handleCancelBooking = async (bookingId: string) => {
    setCancelling(bookingId);
    try {
      await dispatch(cancelBooking(bookingId)).unwrap();
      setToast({
        type: TOAST_TYPE.SUCCESS,
        title: "Prenotazione annullata",
        message: "La tua prenotazione è stata annullata con successo.",
      });
    } catch (error: any) {
      setToast({
        type: TOAST_TYPE.ERROR,
        title: "Errore",
        message: error || "Impossibile annullare la prenotazione.",
      });
    } finally {
      setCancelling(null);
    }
  };

  const getFieldName = (fieldId: string) => {
    const field = fields.find((f) => f._id === fieldId);
    return field?.name || "Unknown Field";
  };

  const getFieldImage = (fieldId: string) => {
    const field = fields.find((f) => f._id === fieldId);
    return (
      field?.image_url ||
      "https://images.unsplash.com/photo-1601868071295-70ae1bf49090?q=80&w=1112&auto=format&fit=crop"
    );
  };

  const getStatusVariant = (
    status: BookingStatus,
  ): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return "default";
      case BookingStatus.PENDING:
        return "secondary";
      case BookingStatus.CANCELLED:
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      <AppHeader user={user} />
      <div className="max-w-400 mx-auto p-6 lg:p-8 space-y-8">
        {/* My Bookings Section */}
        <div className="mb-8">
          <div className="flex flex-row items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Le Mie Prenotazioni</h2>
          </div>

          {bookingsLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">
                Caricamento prenotazioni...
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Nessuna Prenotazione
                </h3>
                <p className="text-muted-foreground text-center mb-4">
                  Non hai ancora prenotato nessun campo. Inizia ora!
                </p>
                <Button onClick={() => router.push("/fields")}>
                  Prenota il Tuo Primo Campo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookings.map((booking) => {
                const startDate = new Date(booking.start_time);
                const endDate = new Date(booking.end_time);
                const isPast = endDate < new Date();
                const isToday =
                  format(startDate, "yyyy-MM-dd") ===
                  format(new Date(), "yyyy-MM-dd");

                console.log("Booking: ", booking);

                return (
                  <Card
                    key={booking._id}
                    className={cn(
                      "overflow-hidden hover:shadow-lg transition-all cursor-pointer group p-0 rounded relative",
                      isPast && "opacity-75",
                    )}
                  >
                    <CardContent className="p-0 flex flex-col h-full">
                      {/* Header Section with Image */}
                      <div className="relative h-32 bg-gradient-to-br from-primary via-primary/90 to-primary/70">
                        <Image
                          src={getFieldImage(booking.field_id)}
                          alt={getFieldName(booking.field_id)}
                          width={400}
                          height={128}
                          className="w-full h-full object-cover opacity-50"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                        {/* Status Badge */}
                        <Badge
                          className="absolute top-3 right-3"
                          variant={getStatusVariant(booking.status)}
                        >
                          {booking.status === BookingStatus.CONFIRMED &&
                            "Confermata"}
                          {booking.status === BookingStatus.PENDING &&
                            "In Attesa"}
                          {booking.status === BookingStatus.CANCELLED &&
                            "Annullata"}
                        </Badge>

                        {/* Date Badge */}
                        {isToday &&
                          booking.status !== BookingStatus.CANCELLED && (
                            <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600">
                              Oggi
                            </Badge>
                          )}

                        {/* Field Name */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-lg font-bold text-white truncate">
                            {getFieldName(booking.field_id)}
                          </h3>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-5 flex flex-col flex-grow">
                        {/* Date and Time Info Cards */}
                        <div className="space-y-2 mb-4">
                          {/* Date Card */}
                          <div className="flex items-center gap-3 p-3 rounded bg-gray-50 border border-gray-200">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                              <Calendar1Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-muted-foreground font-medium">
                                Data
                              </p>
                              <p className="text-sm font-semibold text-gray-900 truncate">
                                {capitalize(
                                  format(startDate, "EEEE, d MMMM yyyy", {
                                    locale: it,
                                  }),
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Time Card */}
                          <div className="flex items-center gap-3 p-3 rounded bg-gray-50 border border-gray-200">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                              <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground font-medium">
                                Orario
                              </p>
                              <p className="text-sm font-semibold text-gray-900">
                                {format(startDate, "HH:mm")} -{" "}
                                {format(endDate, "HH:mm")}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Price Section */}
                        <div className="flex items-center gap-3 p-3 rounded bg-gray-50 border border-gray-200 mb-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                            <EuroIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground font-medium">
                              Totale
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              €{booking.total_price.toFixed(2)}
                            </p>
                          </div>{" "}
                        </div>

                        {/* Action Button */}
                        <div className="mt-auto">
                          {booking.status === BookingStatus.CONFIRMED &&
                            !isPast && (
                              <Button
                                variant="outline"
                                className="h-8 w-full text-destructive hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 rounded group/btn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelBooking(booking._id);
                                }}
                                disabled={cancelling === booking._id}
                              >
                                {cancelling === booking._id ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  </>
                                ) : (
                                  <>Annulla Prenotazione</>
                                )}
                              </Button>
                            )}

                          {booking.status === BookingStatus.CANCELLED && (
                            <div className="items-center text-center px-3 py-1 rounded bg-gray-50 border border-gray-200">
                              <p className="text-sm text-muted-foreground">
                                Prenotazione annullata
                              </p>
                            </div>
                          )}

                          {isPast &&
                            booking.status === BookingStatus.CONFIRMED && (
                              <div className="items-center text-center px-3 py-1 rounded bg-green-50 border border-green-200">
                                <p className="text-sm text-green-700 font-medium">
                                  Completata
                                </p>
                              </div>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
