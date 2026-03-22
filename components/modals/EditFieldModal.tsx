"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateField } from "@/components/api/connectors/fieldApi";
import { Field, SportType } from "@/lib/types/field";
import { fetchMySportsCenters } from "../api/connectors/sportsCenterApi";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { setToast, TOAST_TYPE } from "../ui/toast";

interface EditFieldModalProps {
  field: Field;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditFieldModal({
  field,
  isOpen,
  onClose,
}: EditFieldModalProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    sports_center_id: field.sports_center_id,
    name: field.name,
    sport_type: field.sport_type,
    hourly_rate: field.hourly_rate.toString(),
    description: field.description || "",
    is_active: field.is_active,
  });
  const { sportsCenters } = useAppSelector((state) => state.sportsCenters);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchMySportsCenters());
  }, [dispatch]);

  useEffect(() => {
    setFormData({
      sports_center_id: field.sports_center_id,
      name: field.name,
      sport_type: field.sport_type,
      hourly_rate: field.hourly_rate.toString(),
      description: field.description || "",
      is_active: field.is_active,
    });
  }, [field]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await dispatch(
        updateField({
          fieldId: field._id,
          fieldData: {
            ...formData,
            hourly_rate: parseFloat(formData.hourly_rate),
          },
        }),
      ).unwrap();

      setToast({
        type: TOAST_TYPE.SUCCESS,
        title: "Campo aggiornato",
        message: "Le modifiche sono state salvate con successo.",
      });
      onClose();
    } catch (err: any) {
      setToast({
        type: TOAST_TYPE.ERROR,
        title: "Errore",
        message: err || "Impossibile aggiornare il campo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Modifica Campo</DialogTitle>
          <DialogDescription>
            Aggiorna i dettagli del tuo campo sportivo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sports_center">
              Centro Sportivo <span className="text-destructive">*</span>
            </Label>
            <Select
              required
              value={formData.sports_center_id}
              onValueChange={(value) =>
                setFormData({ ...formData, sports_center_id: value })
              }
            >
              <SelectTrigger
                id="sports_center"
                className="rounded h-10 border-gray-300 bg-white"
              >
                <SelectValue placeholder="Seleziona centro sportivo" />
              </SelectTrigger>
              <SelectContent>
                {sportsCenters.map((center) => (
                  <SelectItem key={center._id} value={center._id}>
                    {center.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="field_name">
              Nome Campo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="field_name"
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sport_type">
              Tipo di Sport <span className="text-destructive">*</span>
            </Label>
            <Select
              required
              value={formData.sport_type}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  sport_type: value as SportType,
                })
              }
            >
              <SelectTrigger
                id="sport_type"
                className="w-full rounded h-10 border-gray-300 bg-white"
              >
                <SelectValue placeholder="Seleziona tipo di sport" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SportType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourly_rate">
              Tariffa Oraria (€) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="hourly_rate"
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.hourly_rate}
              onChange={(e) =>
                setFormData({ ...formData, hourly_rate: e.target.value })
              }
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
              className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white resize-none"
              placeholder="Descrizione..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active_edit"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked as boolean })
              }
            />
            <Label
              htmlFor="is_active_edit"
              className="text-sm font-normal cursor-pointer"
            >
              Il campo è disponibile per la prenotazione
            </Label>
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
              {isSubmitting ? "Aggiornamento..." : "Aggiorna Campo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
