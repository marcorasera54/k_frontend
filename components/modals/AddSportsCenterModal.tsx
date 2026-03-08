"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, MapPin, Upload, Plus, X, Clock } from "lucide-react";
import { toast } from "sonner";
import { SportType } from "@/lib/types/field";
import { useAppDispatch } from "@/store/hooks";
import { createSportsCenter } from "@/components/api/connectors/sportsCenterApi";
import { createField } from "@/components/api/connectors/fieldApi";
import { SportsCenterStatus } from "@/lib/types/sports_center";

interface AddSportsCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FieldData {
  id: string;
  name: string;
  sportType: SportType | "";
  hourlyRate: string;
  openingTime: string;
  closingTime: string;
  slotDuration: string; // Duration in minutes
}

export default function AddSportsCenterModal({
  isOpen,
  onClose,
}: AddSportsCenterModalProps) {
  const dispatch = useAppDispatch();
  const [centerData, setCenterData] = useState({
    name: "",
    address: "",
    phone: "",
    description: "",
    logoUrl: "",
  });

  const [fields, setFields] = useState<FieldData[]>([
    {
      id: "1",
      name: "",
      sportType: "",
      hourlyRate: "",
      openingTime: "08:00",
      closingTime: "22:00",
      slotDuration: "60", // Default 60 minutes
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const addField = () => {
    setFields([
      ...fields,
      {
        id: Date.now().toString(),
        name: "",
        sportType: "",
        hourlyRate: "",
        openingTime: "08:00",
        closingTime: "22:00",
        slotDuration: "60",
      },
    ]);
  };

  const removeField = (id: string) => {
    if (fields.length > 1) {
      setFields(fields.filter((f) => f.id !== id));
    }
  };

  const updateField = (id: string, key: keyof FieldData, value: string) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, [key]: value } : f)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Step 1: Create Sports Center
      const centerResult = await dispatch(
        createSportsCenter({
          name: centerData.name,
          description: centerData.description || undefined,
          logo_url: centerData.logoUrl || undefined,
          status: SportsCenterStatus.ACTIVE,
        }),
      ).unwrap();

      // Step 2: Create all fields for this center
      const fieldPromises = fields.map((field) =>
        dispatch(
          createField({
            sports_center_id: centerResult._id,
            name: field.name,
            sport_type: field.sportType as SportType,
            hourly_rate: parseFloat(field.hourlyRate),
            is_active: true,
          }),
        ).unwrap(),
      );

      await Promise.all(fieldPromises);

      toast.success("Centro sportivo creato con successo!", {
        description: `${fields.length} campo/i aggiunto/i`,
      });

      // Reset form
      onClose();
      setCenterData({
        name: "",
        address: "",
        phone: "",
        description: "",
        logoUrl: "",
      });
      setFields([
        {
          id: "1",
          name: "",
          sportType: "",
          hourlyRate: "",
          openingTime: "08:00",
          closingTime: "22:00",
          slotDuration: "60",
        },
      ]);
    } catch (error: any) {
      toast.error("Errore nella creazione del centro", {
        description: error || "Si è verificato un errore. Riprova.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sports = [
    { value: SportType.FOOTBALL, label: "Calcio" },
    { value: SportType.PADEL, label: "Padel" },
    { value: SportType.TENNIS, label: "Tennis" },
    { value: SportType.BASKETBALL, label: "Basket" },
    { value: SportType.VOLLEYBALL, label: "Pallavolo" },
  ];

  const slotDurations = [
    { value: "30", label: "30 minuti" },
    { value: "45", label: "45 minuti" },
    { value: "60", label: "1 ora" },
    { value: "90", label: "1 ora e 30 min" },
    { value: "120", label: "2 ore" },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-white/95 border-white/40">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">
                Aggiungi la Tua Attività
              </DialogTitle>
              <DialogDescription>
                Registra il tuo centro sportivo e configura i campi disponibili
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Center Information */}
          <div className="space-y-4 p-5 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-100">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-gray-800">
              <Building2 className="w-5 h-5 text-blue-600" />
              Informazioni Centro Sportivo
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="name" className="text-gray-700">
                  Nome del Centro *
                </Label>
                <Input
                  id="name"
                  required
                  placeholder="Es. Centro Sportivo Millennium"
                  value={centerData.name}
                  onChange={(e) =>
                    setCenterData({ ...centerData, name: e.target.value })
                  }
                  className="mt-1.5 rounded-lg border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address" className="text-gray-700">
                  Indirizzo Completo *
                </Label>
                <div className="relative mt-1.5">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="address"
                    required
                    placeholder="Via Roma 123, 20121 Milano (MI)"
                    value={centerData.address}
                    onChange={(e) =>
                      setCenterData({ ...centerData, address: e.target.value })
                    }
                    className="pl-10 rounded-lg border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone" className="text-gray-700">
                  Numero di Telefono *
                </Label>
                <Input
                  id="phone"
                  required
                  type="tel"
                  placeholder="+39 123 456 7890"
                  value={centerData.phone}
                  onChange={(e) =>
                    setCenterData({ ...centerData, phone: e.target.value })
                  }
                  className="mt-1.5 rounded-lg border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <Label htmlFor="logo" className="text-gray-700">
                  Logo URL (opzionale)
                </Label>
                <div className="relative mt-1.5">
                  <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="logo"
                    placeholder="https://esempio.com/logo.png"
                    value={centerData.logoUrl}
                    onChange={(e) =>
                      setCenterData({ ...centerData, logoUrl: e.target.value })
                    }
                    className="pl-10 rounded-lg border-gray-200 bg-white focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description" className="text-gray-700">
                  Descrizione
                </Label>
                <Textarea
                  id="description"
                  placeholder="Descrivi il tuo centro sportivo, i servizi offerti, parcheggio, spogliatoi..."
                  value={centerData.description}
                  onChange={(e) =>
                    setCenterData({
                      ...centerData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="mt-1.5 rounded-lg border-gray-200 bg-white resize-none focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* Fields Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  Campi Sportivi
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Aggiungi tutti i campi disponibili nella tua struttura
                </p>
              </div>
              <Button
                type="button"
                onClick={addField}
                variant="outline"
                size="sm"
                className="rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Aggiungi Campo
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-5 rounded-xl bg-white border-2 border-gray-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="font-semibold text-gray-800">
                        Campo {index + 1}
                      </span>
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeField(field.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Rimuovi
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Field Name */}
                    <div className="lg:col-span-2">
                      <Label className="text-gray-700">Nome Campo *</Label>
                      <Input
                        required
                        placeholder="Es. Campo Centrale, Campo 1, Campo A..."
                        value={field.name}
                        onChange={(e) =>
                          updateField(field.id, "name", e.target.value)
                        }
                        className="mt-1.5 rounded-lg focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>

                    {/* Sport Type */}
                    <div>
                      <Label className="text-gray-700">Tipo di Sport *</Label>
                      <Select
                        required
                        value={field.sportType}
                        onValueChange={(value) =>
                          updateField(field.id, "sportType", value)
                        }
                      >
                        <SelectTrigger className="mt-1.5 rounded-lg focus:border-blue-500 focus:ring-blue-500/20">
                          <SelectValue placeholder="Seleziona sport" />
                        </SelectTrigger>
                        <SelectContent>
                          {sports.map((sport) => (
                            <SelectItem key={sport.value} value={sport.value}>
                              {sport.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Hourly Rate */}
                    <div>
                      <Label className="text-gray-700">
                        Tariffa Oraria (€) *
                      </Label>
                      <Input
                        required
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="45.00"
                        value={field.hourlyRate}
                        onChange={(e) =>
                          updateField(field.id, "hourlyRate", e.target.value)
                        }
                        className="mt-1.5 rounded-lg focus:border-blue-500 focus:ring-blue-500/20"
                      />
                    </div>

                    {/* Slot Duration */}
                    <div>
                      <Label className="text-gray-700 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        Durata Slot *
                      </Label>
                      <Select
                        required
                        value={field.slotDuration}
                        onValueChange={(value) =>
                          updateField(field.id, "slotDuration", value)
                        }
                      >
                        <SelectTrigger className="mt-1.5 rounded-lg focus:border-blue-500 focus:ring-blue-500/20">
                          <SelectValue placeholder="Durata prenotazione" />
                        </SelectTrigger>
                        <SelectContent>
                          {slotDurations.map((duration) => (
                            <SelectItem
                              key={duration.value}
                              value={duration.value}
                            >
                              {duration.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-1">
                        Tempo minimo di prenotazione
                      </p>
                    </div>

                    {/* Opening Hours */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-gray-700">Apertura</Label>
                        <Input
                          type="time"
                          value={field.openingTime}
                          onChange={(e) =>
                            updateField(field.id, "openingTime", e.target.value)
                          }
                          className="mt-1.5 rounded-lg focus:border-blue-500 focus:ring-blue-500/20"
                        />
                      </div>
                      <div>
                        <Label className="text-gray-700">Chiusura</Label>
                        <Input
                          type="time"
                          value={field.closingTime}
                          onChange={(e) =>
                            updateField(field.id, "closingTime", e.target.value)
                          }
                          className="mt-1.5 rounded-lg focus:border-blue-500 focus:ring-blue-500/20"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="mt-4 p-3 rounded-lg bg-blue-50 border border-blue-100">
                    <p className="text-sm text-blue-900">
                      <span className="font-medium">Esempio:</span> Con slot di{" "}
                      {slotDurations.find((d) => d.value === field.slotDuration)
                        ?.label || "60 minuti"}{" "}
                      e tariffa di €{field.hourlyRate || "45"}/ora, ogni
                      prenotazione costerà €
                      {field.hourlyRate
                        ? (
                            (parseFloat(field.hourlyRate) *
                              parseInt(field.slotDuration || "60")) /
                            60
                          ).toFixed(2)
                        : "45.00"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg"
            >
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Creazione in corso...
                </>
              ) : (
                <>
                  <Building2 className="w-4 h-4 mr-2" />
                  Crea Centro Sportivo
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
