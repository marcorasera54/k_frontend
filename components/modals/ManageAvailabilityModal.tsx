"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createAvailability,
  fetchFieldAvailability,
  deleteAvailability,
  createBlockedSlot,
  fetchFieldBlockedSlots,
  deleteBlockedSlot,
} from "@/components/api/connectors/availabilityApi";
import { DayOfWeek, DayOfWeekLabel } from "@/lib/types/availability";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Clock, Ban, Trash2 } from "lucide-react";

interface ManageAvailabilityModalProps {
  fieldId: string;
  fieldName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ManageAvailabilityModal({
  fieldId,
  fieldName,
  isOpen,
  onClose,
}: ManageAvailabilityModalProps) {
  const dispatch = useAppDispatch();
  const { availabilities, blockedSlots, isLoading } = useAppSelector(
    (state) => state.availability,
  );
  const [activeTab, setActiveTab] = useState<"schedule" | "blocked">(
    "schedule",
  );
  const [error, setError] = useState<string | null>(null);

  const [scheduleForm, setScheduleForm] = useState({
    day_of_week: DayOfWeek.MONDAY,
    operating_hours: {
      start_time: "09:00",
      end_time: "17:00",
      slot_duration_minutes: 60,
    },
  });

  const [blockedForm, setBlockedForm] = useState({
    blocked_date: "",
    start_time: "09:00",
    end_time: "10:00",
    reason: "",
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchFieldAvailability(fieldId));
      dispatch(fetchFieldBlockedSlots(fieldId));
    }
  }, [isOpen, fieldId, dispatch]);

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await dispatch(
        createAvailability({
          field_id: fieldId,
          ...scheduleForm,
        }),
      ).unwrap();

      alert(
        "Orari di apertura creati con successo! Gli slot saranno generati automaticamente.",
      );
      setScheduleForm({
        day_of_week: DayOfWeek.MONDAY,
        operating_hours: {
          start_time: "09:00",
          end_time: "17:00",
          slot_duration_minutes: 60,
        },
      });
    } catch (err: any) {
      setError(err || "Impossibile creare gli orari di apertura");
    }
  };

  const handleDeleteSchedule = async (availabilityId: string) => {
    if (!confirm("Sei sicuro di voler eliminare questo orario?")) return;

    try {
      await dispatch(deleteAvailability(availabilityId)).unwrap();
      alert("Orario eliminato con successo!");
    } catch (err: any) {
      alert(err || "Impossibile eliminare l'orario");
    }
  };

  const handleCreateBlockedSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await dispatch(
        createBlockedSlot({
          field_id: fieldId,
          ...blockedForm,
        }),
      ).unwrap();

      alert("Fascia oraria bloccata con successo!");
      setBlockedForm({
        blocked_date: "",
        start_time: "09:00",
        end_time: "10:00",
        reason: "",
      });
    } catch (err: any) {
      setError(err || "Impossibile bloccare la fascia oraria");
    }
  };

  const handleDeleteBlockedSlot = async (blockedSlotId: string) => {
    if (!confirm("Sei sicuro di voler rimuovere questo slot bloccato?")) return;

    try {
      await dispatch(deleteBlockedSlot(blockedSlotId)).unwrap();
      alert("Slot bloccato rimosso con successo!");
    } catch (err: any) {
      alert(err || "Impossibile rimuovere lo slot bloccato");
    }
  };

  const calculateTotalSlots = (
    startTime: string,
    endTime: string,
    duration: number,
  ) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const totalMinutes = endMinutes - startMinutes;
    return Math.floor(totalMinutes / duration);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Gestisci Disponibilità</DialogTitle>
          <DialogDescription>{fieldName}</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert
            variant="destructive"
            className="border border-gray-200 bg-white rounded transition-all duration-300 py-4 cursor-pointer"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "schedule" | "blocked")
          }
        >
          <TabsList className="rounded-md grid w-full grid-cols-2">
            <TabsTrigger
              value="schedule"
              className="rounded flex items-center gap-2"
            >
              <Clock className="h-4 w-4" />
              Orari di Apertura
            </TabsTrigger>
            <TabsTrigger
              value="blocked"
              className="rounded flex items-center gap-2"
            >
              <Ban className="h-4 w-4" />
              Slot Bloccati
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6 mt-6">
            <Card className="border border-gray-100 bg-white rounded hover:border-gray-200 transition-all duration-300 py-4 cursor-pointer">
              <CardHeader>
                <CardTitle>Imposta Orari di Apertura</CardTitle>
                <CardDescription>
                  Gli slot di prenotazione verranno generati automaticamente in
                  base ai tuoi orari di apertura.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSchedule} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="day_of_week">
                      Giorno della Settimana{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      required
                      value={scheduleForm.day_of_week}
                      onValueChange={(value) =>
                        setScheduleForm({
                          ...scheduleForm,
                          day_of_week: value as DayOfWeek,
                        })
                      }
                    >
                      <SelectTrigger
                        id="day_of_week"
                        className="rounded h-10 border-gray-300 bg-white"
                      >
                        <SelectValue placeholder="Seleziona giorno" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(DayOfWeek).map((day) => (
                          <SelectItem key={day} value={day}>
                            {DayOfWeekLabel[day]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_time">
                        Orario di Apertura{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="start_time"
                        type="time"
                        required
                        value={scheduleForm.operating_hours.start_time}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            operating_hours: {
                              ...scheduleForm.operating_hours,
                              start_time: e.target.value,
                            },
                          })
                        }
                        className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_time">
                        Orario di Chiusura{" "}
                        <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="end_time"
                        type="time"
                        required
                        value={scheduleForm.operating_hours.end_time}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            operating_hours: {
                              ...scheduleForm.operating_hours,
                              end_time: e.target.value,
                            },
                          })
                        }
                        className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slot_duration">
                      Durata Slot (minuti){" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      required
                      value={scheduleForm.operating_hours.slot_duration_minutes.toString()}
                      onValueChange={(value) =>
                        setScheduleForm({
                          ...scheduleForm,
                          operating_hours: {
                            ...scheduleForm.operating_hours,
                            slot_duration_minutes: parseInt(value),
                          },
                        })
                      }
                    >
                      <SelectTrigger
                        id="slot_duration"
                        className="rounded h-10 border-gray-300 bg-white"
                      >
                        <SelectValue placeholder="Seleziona durata" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minuti</SelectItem>
                        <SelectItem value="30">30 minuti</SelectItem>
                        <SelectItem value="60">1 ora</SelectItem>
                        <SelectItem value="90">1,5 ore</SelectItem>
                        <SelectItem value="120">2 ore</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Questo genererà{" "}
                      {calculateTotalSlots(
                        scheduleForm.operating_hours.start_time,
                        scheduleForm.operating_hours.end_time,
                        scheduleForm.operating_hours.slot_duration_minutes,
                      )}{" "}
                      slot
                    </p>
                  </div>

                  <Button type="submit" className="w-full rounded">
                    Imposta
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Orari di Apertura Attuali
              </h3>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Caricamento...
                </div>
              ) : availabilities.length === 0 ? (
                <Card className="border border-gray-100 bg-white rounded hover:border-gray-200 transition-all duration-300 py-4 cursor-pointer">
                  <CardContent className="text-center py-8 text-muted-foreground">
                    Nessun orario di apertura configurato
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {availabilities.map((availability) => (
                    <Card
                      key={availability._id}
                      className="border border-gray-100 bg-white rounded hover:border-gray-200 transition-all duration-300 py-4 cursor-pointer"
                    >
                      <CardContent>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium capitalize">
                              {availability.day_of_week}
                            </h4>
                            <div className="mt-2 text-sm text-muted-foreground space-y-1">
                              <p>
                                {availability.operating_hours.start_time} -{" "}
                                {availability.operating_hours.end_time}
                              </p>
                              <p className="text-xs">
                                Slot da{" "}
                                {
                                  availability.operating_hours
                                    .slot_duration_minutes
                                }{" "}
                                min (
                                {calculateTotalSlots(
                                  availability.operating_hours.start_time,
                                  availability.operating_hours.end_time,
                                  availability.operating_hours
                                    .slot_duration_minutes,
                                )}{" "}
                                slot totali)
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteSchedule(availability._id)
                            }
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="blocked" className="space-y-6 mt-6">
            <Card className="border border-gray-100 bg-white rounded hover:border-gray-200 transition-all duration-300 py-4 cursor-pointer">
              <CardHeader>
                <CardTitle>Blocca Fascia Oraria</CardTitle>
                <CardDescription>
                  Blocca fasce orarie specifiche per manutenzione, eventi o
                  altri motivi.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateBlockedSlot} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="blocked_date">
                      Data <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="blocked_date"
                      type="date"
                      required
                      value={blockedForm.blocked_date}
                      onChange={(e) =>
                        setBlockedForm({
                          ...blockedForm,
                          blocked_date: e.target.value,
                        })
                      }
                      className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="blocked_start_time">
                        Ora Inizio <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="blocked_start_time"
                        type="time"
                        required
                        value={blockedForm.start_time}
                        onChange={(e) =>
                          setBlockedForm({
                            ...blockedForm,
                            start_time: e.target.value,
                          })
                        }
                        className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blocked_end_time">
                        Ora Fine <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="blocked_end_time"
                        type="time"
                        required
                        value={blockedForm.end_time}
                        onChange={(e) =>
                          setBlockedForm({
                            ...blockedForm,
                            end_time: e.target.value,
                          })
                        }
                        className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white resize-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Motivo (Facoltativo)</Label>
                    <Input
                      id="reason"
                      type="text"
                      value={blockedForm.reason}
                      onChange={(e) =>
                        setBlockedForm({
                          ...blockedForm,
                          reason: e.target.value,
                        })
                      }
                      placeholder="es., Manutenzione, Evento Privato, ecc."
                      className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white resize-none"
                    />
                  </div>

                  <Button type="submit" className="rounded w-full">
                    Blocca
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Fasce Orarie Bloccate
              </h3>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Caricamento...
                </div>
              ) : blockedSlots.length === 0 ? (
                <Card className="border border-gray-100 bg-white rounded hover:border-gray-200 transition-all duration-300 py-4 cursor-pointer">
                  <CardContent className="text-center py-8 text-muted-foreground">
                    Nessuna fascia oraria bloccata
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {blockedSlots.map((blocked) => (
                    <Card key={blocked._id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">
                              {new Date(
                                blocked.blocked_date,
                              ).toLocaleDateString("it-IT")}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {blocked.start_time} - {blocked.end_time}
                            </p>
                            {blocked.reason && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {blocked.reason}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBlockedSlot(blocked._id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded w-full"
          >
            Chiudi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
