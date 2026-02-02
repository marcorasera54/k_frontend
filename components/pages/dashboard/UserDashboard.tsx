"use client";

import { useEffect, useState } from "react";
import { User } from "@/lib/types/auth";
import { Field, SportType } from "@/lib/types/field";
import { AvailableSlot } from "@/lib/types/availability";
import { useAppDispatch } from "@/store/hooks";
import { fetchFields } from "@/components/api/connectors/fieldApi";
import { fetchAvailableSlots, createBlockedSlot } from "@/components/api/connectors/availabilityApi";
import { createBooking } from "@/components/api/connectors/bookingApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Dumbbell,
  MapPin,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface UserDashboardProps {
  user: User;
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const dispatch = useAppDispatch();

  // State
  const [selectedSport, setSelectedSport] = useState<SportType | null>(null);
  const [date, setDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load fields when sport changes
  useEffect(() => {
    if (selectedSport) {
      setIsLoading(true);
      dispatch(fetchFields({ sport_type: selectedSport, is_active: true }))
        .unwrap()
        .then((data) => {
          setFields(data);
          setSelectedField(null); // Reset field selection
          setSlots([]); // Reset slots
        })
        .catch(() => toast.error("Errore nel caricamento dei campi"))
        .finally(() => setIsLoading(false));
    }
  }, [selectedSport, dispatch]);

  // Load slots when field or date changes
  useEffect(() => {
    if (selectedField && date) {
      setIsLoading(true);
      dispatch(fetchAvailableSlots({ fieldId: selectedField._id, date }))
        .unwrap()
        .then((data) => setSlots(data))
        .catch(() => toast.error("Errore nel caricamento degli orari"))
        .finally(() => setIsLoading(false));
    }
  }, [selectedField, date, dispatch]);

  const handleBook = async () => {
    if (!selectedField || !selectedSlot || !date) return;

    try {
      setIsLoading(true);

      const dateObj = new Date(date);

      // Start time
      const startTimeParts = selectedSlot.start_time.split(":");
      const startDateTime = new Date(dateObj);
      startDateTime.setHours(parseInt(startTimeParts[0]), parseInt(startTimeParts[1]), 0);

      // End time
      const endTimeParts = selectedSlot.end_time.split(":");
      const endDateTime = new Date(dateObj);
      endDateTime.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]), 0);

      await dispatch(
        createBooking({
          field_id: selectedField._id,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
        })
      ).unwrap();

      toast.success("Prenotazione confermata!");
      setIsBookingModalOpen(false);
      setSelectedSlot(null);

      // Refresh slots
      dispatch(fetchAvailableSlots({ fieldId: selectedField._id, date }))
        .unwrap()
        .then(setSlots);

    } catch (error: any) {
      toast.error(error || "Errore durante la prenotazione");
    } finally {
      setIsLoading(false);
    }
  };

  const sports = [
    { type: SportType.FOOTBALL, label: "Calcio a 5", icon: Trophy, color: "bg-green-100 text-green-600" },
    { type: SportType.PADEL, label: "Padel", icon: Dumbbell, color: "bg-blue-100 text-blue-600" },
    { type: SportType.TENNIS, label: "Tennis", icon: Trophy, color: "bg-orange-100 text-orange-600" },
    { type: SportType.BASKETBALL, label: "Basket", icon: Trophy, color: "bg-orange-100 text-orange-600" },
    { type: SportType.VOLLEYBALL, label: "Pallavolo", icon: Trophy, color: "bg-yellow-100 text-yellow-600" },
  ];

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ciao, {user.first_name}!</h1>
          <p className="text-muted-foreground">Prenota il tuo prossimo campo in pochi click.</p>
        </div>
      </div>

      {/* Sport Selection */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Scegli lo sport</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {sports.map((sport) => (
            <Card
              key={sport.type}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md border-2",
                selectedSport === sport.type
                  ? "border-primary bg-primary/5"
                  : "border-transparent hover:border-gray-200"
              )}
              onClick={() => setSelectedSport(sport.type)}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 gap-3 text-center">
                <div className={cn("p-3 rounded-full", sport.color)}>
                  <sport.icon className="w-6 h-6" />
                </div>
                <span className="font-medium">{sport.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {selectedSport && (
        <div className="grid md:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Left Column: Date & Fields */}
          <div className="md:col-span-4 space-y-8">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">2. Quando?</h2>
              <div className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="date" className="text-sm font-medium text-gray-700">Seleziona una data</label>
                  <input
                    type="date"
                    id="date"
                    value={date}
                    min={format(new Date(), "yyyy-MM-dd")}
                    onChange={(e) => setDate(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">3. Dove?</h2>
              <div className="h-[300px] overflow-y-auto rounded-md border p-4 bg-white shadow-sm">
                {fields.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {isLoading ? "Caricamento..." : "Nessun campo disponibile per questo sport."}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {fields.map((field) => (
                      <div
                        key={field._id}
                        onClick={() => setSelectedField(field)}
                        className={cn(
                          "p-4 rounded-lg border cursor-pointer transition-colors flex items-center justify-between",
                          selectedField?._id === field._id
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "hover:bg-gray-50 bg-white"
                        )}
                      >
                        <div>
                          <p className="font-medium">{field.name}</p>
                          <p className="text-sm text-muted-foreground">{field.hourly_rate}€ / ora</p>
                        </div>
                        {selectedField?._id === field._id && (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right Column: Slots */}
          <div className="md:col-span-8 space-y-4">
            <h2 className="text-xl font-semibold">4. Orari Disponibili</h2>
            <Card className="min-h-[500px] border-dashed shadow-sm">
              <CardContent className="p-6">
                {!selectedField ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-20">
                    <MapPin className="w-12 h-12 mb-4 opacity-20" />
                    <p>Seleziona un campo per vedere gli orari</p>
                  </div>
                ) : isLoading ? (
                  <div className="h-full flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : slots.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground py-20">
                    <Clock className="w-12 h-12 mb-4 opacity-20" />
                    <p>Nessun orario disponibile per questa data.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {slots.map((slot, index) => (
                      <Button
                        key={index}
                        variant={slot.is_available ? (selectedSlot === slot ? "default" : "outline") : "ghost"}
                        disabled={!slot.is_available}
                        className={cn(
                          "h-auto py-4 flex flex-col gap-1",
                          !slot.is_available && "opacity-50 cursor-not-allowed bg-gray-50"
                        )}
                        onClick={() => slot.is_available && setSelectedSlot(slot)}
                      >
                        <span className="text-lg font-bold">
                          {slot.start_time.slice(0, 5)}
                        </span>
                        <span className="text-xs font-normal text-muted-foreground">
                          {slot.price}€
                        </span>
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
              <Button
                size="lg"
                disabled={!selectedSlot || !selectedField || !date}
                onClick={() => setIsBookingModalOpen(true)}
                className="w-full md:w-auto text-lg px-8"
              >
                Prenota Ora
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <Dialog open={isBookingModalOpen} onOpenChange={setIsBookingModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conferma Prenotazione</DialogTitle>
            <DialogDescription>
              Rivedi i dettagli della tua prenotazione.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Sport</span>
              <span className="font-medium capitalize">{selectedSport}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Campo</span>
              <span className="font-medium">{selectedField?.name}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Data</span>
              <span className="font-medium">{date && format(new Date(date), "d MMMM yyyy", { locale: it })}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Orario</span>
              <span className="font-medium">
                {selectedSlot?.start_time.slice(0, 5)} - {selectedSlot?.end_time.slice(0, 5)}
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-lg font-bold">Totale</span>
              <span className="text-lg font-bold text-primary">{selectedSlot?.price}€</span>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingModalOpen(false)}>Annulla</Button>
            <Button onClick={handleBook} disabled={isLoading}>
              {isLoading ? "Conferma in corso..." : "Conferma e Paga"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}