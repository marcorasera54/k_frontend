"use client";

import { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchAllBookings,
  managerCancelBooking,
} from "@/components/api/connectors/bookingApi";
import { fetchFields } from "@/components/api/connectors/fieldApi";
import { Booking, BookingStatus } from "@/lib/types/booking";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  Calendar,
  Clock,
  Euro,
  Search,
  XCircle,
  CheckCircle2,
  Loader2,
  User,
  AlertCircle,
  Mail,
  Phone,
  UserCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; color: string; Icon: any }
> = {
  [BookingStatus.CONFIRMED]: {
    label: "Confermata",
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Icon: CheckCircle2,
  },
  [BookingStatus.CANCELLED]: {
    label: "Annullata",
    color: "bg-red-100 text-red-700 border-red-200",
    Icon: XCircle,
  },
  [BookingStatus.PENDING]: {
    label: "In attesa",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    Icon: Clock,
  },
};

const PAGE_SIZE = 10;

export default function ManagerBookingsTab() {
  const dispatch = useAppDispatch();
  const { bookings, pagination, isLoading } = useAppSelector((s) => s.bookings);
  const { fields } = useAppSelector((s) => s.fields);

  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fieldFilter, setFieldFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean;
    bookingId: string;
  }>({ open: false, bookingId: "" });
  const [cancelling, setCancelling] = useState<string | null>(null);

  const fetchBookings = useCallback(() => {
    dispatch(
      fetchAllBookings({
        search: search || undefined,
        status: statusFilter !== "all" ? statusFilter : undefined,
        field_id: fieldFilter !== "all" ? fieldFilter : undefined,
        page,
        page_size: PAGE_SIZE,
      }),
    );
  }, [dispatch, search, statusFilter, fieldFilter, page]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);
  useEffect(() => {
    dispatch(fetchFields({}));
  }, [dispatch]);

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const handleStatusChange = (v: string) => {
    setStatusFilter(v);
    setPage(1);
  };
  const handleFieldChange = (v: string) => {
    setFieldFilter(v);
    setPage(1);
  };

  const getFieldName = (fieldId: string) =>
    fields.find((f) => f._id === fieldId)?.name ?? "Campo sconosciuto";

  const handleCancel = async () => {
    if (!cancelDialog.bookingId) return;
    setCancelling(cancelDialog.bookingId);
    try {
      await dispatch(managerCancelBooking(cancelDialog.bookingId)).unwrap();
      fetchBookings();
    } catch (e: any) {
      alert(e || "Errore durante l'annullamento");
    } finally {
      setCancelling(null);
      setCancelDialog({ open: false, bookingId: "" });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        Prenotazioni
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cerca per nome, cognome o email..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 rounded"
          />
        </div>

        <Select value={statusFilter} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-44 rounded">
            <SelectValue placeholder="Stato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti gli stati</SelectItem>
            <SelectItem value={BookingStatus.CONFIRMED}>Confermate</SelectItem>
            <SelectItem value={BookingStatus.CANCELLED}>Annullate</SelectItem>
            <SelectItem value={BookingStatus.PENDING}>In attesa</SelectItem>
          </SelectContent>
        </Select>

        <Select value={fieldFilter} onValueChange={handleFieldChange}>
          <SelectTrigger className="w-full sm:w-48 rounded">
            <SelectValue placeholder="Campo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti i campi</SelectItem>
            {fields.map((f) => (
              <SelectItem key={f._id} value={f._id}>
                {f.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">
            Caricamento prenotazioni...
          </p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-muted p-4 rounded-full mb-3">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="font-medium">Nessuna prenotazione trovata</p>
          <p className="text-sm text-muted-foreground mt-1">
            Prova a cambiare i filtri di ricerca
          </p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <div className="hidden md:grid grid-cols-[minmax(0,2.5fr)_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.2fr)_120px] gap-0 px-4 py-3 bg-muted/50 text-xs font-medium text-muted-foreground uppercase tracking-wide border-b">
            <span className="flex items-center gap-2">
              {" "}
              <User className="h-4 w-4 text-primary" />
              Utente / Campo
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              Data e orario
            </span>
            <span className="flex items-center gap-2">
              <Euro className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              Importo
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              Stato
            </span>
            <span className="text-right">Azione</span>
          </div>

          <div className="divide-y">
            {bookings.map((booking) => {
              const statusCfg = STATUS_CONFIG[booking.status];
              const fieldName = getFieldName(booking.field_id);
              const start = new Date(booking.start_time);
              const end = new Date(booking.end_time);
              const isPast = start < new Date();
              const isCancellable =
                booking.status === BookingStatus.CONFIRMED && !isPast;

              return (
                <div
                  key={booking._id}
                  className="grid grid-cols-1 md:grid-cols-[minmax(0,2.5fr)_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.2fr)_120px] gap-0 px-4 py-3 items-center hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => setSelectedBooking(booking)}
                >
                  {/* User + field */}
                  <div className="flex items-center gap-2.5 py-1 pr-4">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {booking.user_first_name
                          ? `${booking.user_first_name} ${booking.user_last_name ?? ""}`
                          : "Utente sconosciuto"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {fieldName}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 py-1 pr-4">
                    <div>
                      <p className="text-sm font-medium">
                        {format(start, "d MMM yyyy", { locale: it })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(start, "HH:mm")} – {format(end, "HH:mm")}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-1.5 py-1 pr-4">
                    <span className="text-sm font-semibold">
                      €{booking.total_price.toFixed(2)}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="flex items-center py-1 pr-4">
                    <Badge
                      variant="outline"
                      className={`flex items-center gap-1.5 text-xs whitespace-nowrap ${statusCfg.color}`}
                    >
                      {statusCfg.label}
                    </Badge>
                  </div>

                  {/* Action */}
                  <div className="flex items-center justify-end py-1">
                    {isCancellable ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setCancelDialog({
                            open: true,
                            bookingId: booking._id,
                          })
                        }
                        disabled={cancelling === booking._id}
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded"
                      >
                        <span className="text-xs">Annulla</span>
                      </Button>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {isPast && booking.status === BookingStatus.CONFIRMED
                          ? "Completata"
                          : "—"}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pagination */}
      {pagination.total_pages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">
            {pagination.total} prenotazioni · pagina {pagination.page} di{" "}
            {pagination.total_pages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="rounded"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || isLoading}
            >
              <ChevronLeft className="h-4 w-4" />
              Precedente
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded"
              onClick={() =>
                setPage((p) => Math.min(pagination.total_pages, p + 1))
              }
              disabled={page >= pagination.total_pages || isLoading}
            >
              Successiva
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* User detail dialog */}
      <Dialog
        open={!!selectedBooking}
        onOpenChange={(o) => !o && setSelectedBooking(null)}
      >
        <DialogContent className="max-w-sm rounded-xl">
          <DialogHeader>
            <DialogTitle>Dettagli prenotazione</DialogTitle>
          </DialogHeader>
          {selectedBooking &&
            (() => {
              const start = new Date(selectedBooking.start_time);
              const end = new Date(selectedBooking.end_time);
              const statusCfg = STATUS_CONFIG[selectedBooking.status];
              const StatusIcon = statusCfg.Icon;
              return (
                <div className="space-y-5 pt-1">
                  {/* User */}
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <UserCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-base">
                        {selectedBooking.user_first_name
                          ? `${selectedBooking.user_first_name} ${selectedBooking.user_last_name ?? ""}`
                          : "Nome non disponibile"}
                      </p>
                    </div>
                  </div>

                  {/* Contacts */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Contatti
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span>
                          {selectedBooking.user_email ??
                            "Email non disponibile"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking details */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Prenotazione
                    </p>
                    <div className="rounded-lg border divide-y">
                      {[
                        {
                          label: "Campo",
                          value: getFieldName(selectedBooking.field_id),
                        },
                        {
                          label: "Data",
                          value: format(start, "d MMM yyyy", { locale: it }),
                        },
                        {
                          label: "Orario",
                          value: `${format(start, "HH:mm")} – ${format(end, "HH:mm")}`,
                        },
                        {
                          label: "Importo",
                          value: `€${selectedBooking.total_price.toFixed(2)}`,
                        },
                        {
                          label: "Creata il",
                          value: format(
                            new Date(selectedBooking.created_at),
                            "d MMM yyyy · HH:mm",
                            { locale: it },
                          ),
                        },
                      ].map(({ label, value }) => (
                        <div
                          key={label}
                          className="flex justify-between items-center px-3 py-2 text-sm"
                        >
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center px-3 py-2 text-sm">
                        <span className="text-muted-foreground">Stato</span>
                        <Badge
                          variant="outline"
                          className={`flex items-center gap-1 text-xs ${statusCfg.color}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          {statusCfg.label}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Cancel from dialog */}
                  {selectedBooking.status === BookingStatus.CONFIRMED &&
                    new Date(selectedBooking.start_time) > new Date() && (
                      <Button
                        variant="ghost"
                        className="w-full border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded"
                        onClick={() => {
                          setSelectedBooking(null);
                          setCancelDialog({
                            open: true,
                            bookingId: selectedBooking._id,
                          });
                        }}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Annulla prenotazione
                      </Button>
                    )}
                </div>
              );
            })()}
        </DialogContent>
      </Dialog>

      {/* Cancel confirm */}
      <AlertDialog
        open={cancelDialog.open}
        onOpenChange={(o) =>
          !o && setCancelDialog({ open: false, bookingId: "" })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Annulla prenotazione
            </AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler annullare questa prenotazione? L'utente
              riceverà una notifica.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded" disabled={!!cancelling}>
              Indietro
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={!!cancelling}
              className="bg-red-600 hover:bg-red-700 rounded"
            >
              {cancelling ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Annullamento...
                </>
              ) : (
                "Conferma annullamento"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
