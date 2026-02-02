"use client";
import { useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { createSportsCenter } from "@/components/api/connectors/sportsCenterApi";
import {
  SportsCenterStatus,
  SportsCenterStatusLabel,
} from "@/lib/types/sports_center";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

interface CreateSportsCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateSportsCenterModal({
  isOpen,
  onClose,
}: CreateSportsCenterModalProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    logo_url: "",
    status: SportsCenterStatus.ACTIVE,
    contact_info: {
      phone: "",
      email: "",
      website: "",
      address: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const contactInfo = Object.fromEntries(
        Object.entries(formData.contact_info).filter(([_, v]) => v !== ""),
      );

      await dispatch(
        createSportsCenter({
          name: formData.name,
          description: formData.description || undefined,
          logo_url: formData.logo_url || undefined,
          status: formData.status,
          contact_info:
            Object.keys(contactInfo).length > 0 ? contactInfo : undefined,
        }),
      ).unwrap();

      alert("Centro sportivo creato con successo!");
      onClose();
      setFormData({
        name: "",
        description: "",
        logo_url: "",
        status: SportsCenterStatus.ACTIVE,
        contact_info: {
          phone: "",
          email: "",
          website: "",
          address: "",
        },
      });
    } catch (err: any) {
      setError(err || "Impossibile creare il centro sportivo");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Crea Nuovo Centro Sportivo
          </DialogTitle>
          <DialogDescription>
            Aggiungi un nuovo centro sportivo alla tua organizzazione
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Nome Centro <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Complesso Sportivo Centro"
                className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrizione</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                placeholder="Breve descrizione del tuo centro sportivo..."
                className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="logo_url">URL Logo</Label>
              <Input
                id="logo_url"
                type="url"
                value={formData.logo_url}
                onChange={(e) =>
                  setFormData({ ...formData, logo_url: e.target.value })
                }
                placeholder="https://esempio.com/logo.png"
                className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Stato <span className="text-destructive">*</span>
              </Label>
              <Select
                required
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as SportsCenterStatus,
                  })
                }
              >
                <SelectTrigger
                  id="status"
                  className="rounded h-10 border-gray-300 bg-white"
                >
                  <SelectValue placeholder="Seleziona stato" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(SportsCenterStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {SportsCenterStatusLabel[status]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.contact_info.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact_info: {
                        ...formData.contact_info,
                        phone: e.target.value,
                      },
                    })
                  }
                  placeholder="+39 123 456 7890"
                  className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contact_info.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact_info: {
                        ...formData.contact_info,
                        email: e.target.value,
                      },
                    })
                  }
                  placeholder="contatto@esempio.com"
                  className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Sito Web</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.contact_info.website}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact_info: {
                        ...formData.contact_info,
                        website: e.target.value,
                      },
                    })
                  }
                  placeholder="https://esempio.com"
                  className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Indirizzo</Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.contact_info.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact_info: {
                        ...formData.contact_info,
                        address: e.target.value,
                      },
                    })
                  }
                  placeholder="Via Roma 123, Città, Provincia"
                  className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded flex-1"
            >
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="rounded flex-1"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Creazione..." : "Crea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
