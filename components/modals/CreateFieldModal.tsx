"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createField } from "@/components/api/connectors/fieldApi";
import { SportType } from "@/lib/types/field";
import { fetchMySportsCenters } from "../api/connectors/sportsCenterApi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, ImageIcon, X } from "lucide-react";
import { uploadImage } from "../api/connectors/uploadApi";

interface CreateFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateFieldModal({
  isOpen,
  onClose,
}: CreateFieldModalProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    sports_center_id: "",
    name: "",
    sport_type: SportType.FOOTBALL,
    hourly_rate: "",
    description: "",
    is_active: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { sportsCenters } = useAppSelector((state) => state.sportsCenters);

  useEffect(() => {
    dispatch(fetchMySportsCenters());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      let image_url: string | undefined;
      let image_file_id: string | undefined;

      if (imageFile) {
        setIsUploading(true);
        const uploaded = await uploadImage(imageFile, "/fields");
        image_url = uploaded.url;
        image_file_id = uploaded.file_id;
        setIsUploading(false);
      }

      await dispatch(
        createField({
          ...formData,
          hourly_rate: parseFloat(formData.hourly_rate),
          image_url,
          image_file_id,
        }),
      ).unwrap();

      onClose();
      setFormData({
        sports_center_id: "",
        name: "",
        sport_type: SportType.FOOTBALL,
        hourly_rate: "",
        description: "",
        is_active: true,
      });
      setImageFile(null);
      setImagePreview(null);
    } catch (err: any) {
      setIsUploading(false);
      setError(err || "Impossibile creare il campo");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setError(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Crea Nuovo Campo
          </DialogTitle>
          <DialogDescription>
            Aggiungi un nuovo campo a uno dei tuoi centri sportivi. Tutti i
            campi contrassegnati con * sono obbligatori.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="sports_center_id">
              Centro Sportivo <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.sports_center_id}
              onValueChange={(value) =>
                setFormData({ ...formData, sports_center_id: value })
              }
              required
            >
              <SelectTrigger
                id="sports_center_id"
                className="rounded h-10 border-gray-300 bg-white"
              >
                <SelectValue placeholder="Seleziona un centro sportivo" />
              </SelectTrigger>
              <SelectContent>
                {sportsCenters.length === 0 ? (
                  <div className="px-2 py-6 text-center text-sm text-slate-500">
                    Nessun centro sportivo disponibile
                  </div>
                ) : (
                  sportsCenters.map((center) => (
                    <SelectItem key={center._id} value={center._id}>
                      {center.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            {sportsCenters.length === 0 && (
              <p className="text-sm text-slate-500">
                Crea prima un centro sportivo
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Nome Campo <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Campo Calcio Principale"
              className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label>Immagine Campo</Label>

            {imagePreview ? (
              <div className="relative w-full h-40 rounded-lg border border-gray-200 overflow-hidden group">
                <img
                  src={imagePreview}
                  alt="Field preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="field_image_upload"
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
              >
                <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">
                  Carica immagine del campo
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WEBP
                </span>
                <input
                  id="field_image_upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sport_type">
              Tipo di Sport <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.sport_type}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  sport_type: value as SportType,
                })
              }
              required
            >
              <SelectTrigger
                id="sport_type"
                className="rounded h-10 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
              >
                <SelectValue />
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
              Tariffa Oraria (€) <span className="text-red-500">*</span>
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
              placeholder="50.00"
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
              placeholder="Descrizione facoltativa del campo..."
              className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white resize-none"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked as boolean })
              }
            />
            <Label
              htmlFor="is_active"
              className="text-sm font-normal cursor-pointer"
            >
              Il campo è attivo e disponibile per la prenotazione
            </Label>
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded flex-1"
            >
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting || isUploading || sportsCenters.length === 0
              }
              className="rounded flex-1 bg-slate-900 hover:bg-slate-800"
            >
              {isSubmitting || isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isUploading ? "Caricamento..." : "Creazione in corso..."}
                </>
              ) : (
                "Crea Campo"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
