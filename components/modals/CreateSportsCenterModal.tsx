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
import { Loader2, ImageIcon, X, Upload } from "lucide-react";
import { uploadImage } from "../api/connectors/uploadApi";
import { setToast, TOAST_TYPE } from "../ui/toast";

interface CreateSportsCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateSportsCenterModal({
  isOpen,
  onClose,
}: CreateSportsCenterModalProps) {
  const dispatch = useAppDispatch();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let logo_url = formData.logo_url || undefined;

      if (logoFile) {
        setIsUploading(true);
        const uploaded = await uploadImage(logoFile, "/sports-centers");
        logo_url = uploaded.url;
      }

      // ← upload all gallery images
      const uploadedImageUrls: string[] = [];
      for (const file of imageFiles) {
        const uploaded = await uploadImage(file, "/sports-centers/gallery");
        uploadedImageUrls.push(uploaded.url);
      }

      setIsUploading(false);

      const contactInfo = Object.fromEntries(
        Object.entries(formData.contact_info).filter(([_, v]) => v !== ""),
      );

      await dispatch(
        createSportsCenter({
          name: formData.name,
          description: formData.description || undefined,
          logo_url,
          images: uploadedImageUrls, // ← pass them here
          status: formData.status,
          contact_info:
            Object.keys(contactInfo).length > 0 ? contactInfo : undefined,
        }),
      ).unwrap();

      setToast({
        type: TOAST_TYPE.SUCCESS,
        title: "Centro sportivo creato",
        message: "Il centro sportivo è stato creato con successo.",
      });
      onClose();
      setFormData({
        name: "",
        description: "",
        logo_url: "",
        status: SportsCenterStatus.ACTIVE,
        contact_info: { phone: "", email: "", website: "", address: "" },
      });
      setLogoFile(null);
      setLogoPreview(null);
      setImageFiles([]);
      setImagePreviews([]);
    } catch (err: any) {
      setIsUploading(false);
      setToast({
        type: TOAST_TYPE.ERROR,
        title: "Errore",
        message: err || "Impossibile creare il centro sportivo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setFormData({ ...formData, logo_url: "" }); // clear old url
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setFormData({ ...formData, logo_url: "" });
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const combined = [...imageFiles, ...files].slice(0, 6); // max 6
    setImageFiles(combined);
    setImagePreviews(combined.map((f) => URL.createObjectURL(f)));
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
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
              <Label>Logo</Label>

              {logoPreview ? (
                <div className="relative w-32 h-32 rounded-lg border border-gray-200 overflow-hidden group">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="logo_upload"
                  className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  <ImageIcon className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500 text-center leading-tight px-1">
                    Carica logo
                  </span>
                  <input
                    id="logo_upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </label>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Immagini Centro{" "}
                <span className="text-xs text-gray-400 font-normal">
                  (max 6)
                </span>
              </Label>

              <div className="flex flex-wrap gap-2">
                {imagePreviews.map((src, i) => (
                  <div
                    key={i}
                    className="relative w-24 h-24 rounded-lg border border-gray-200 overflow-hidden group"
                  >
                    <img
                      src={src}
                      alt={`img-${i}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(i)}
                      className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}

                {imagePreviews.length < 6 && (
                  <label
                    htmlFor="images_upload"
                    className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <Upload className="h-5 w-5 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Aggiungi</span>
                    <input
                      id="images_upload"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      className="hidden"
                      onChange={handleImagesChange}
                    />
                  </label>
                )}
              </div>
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
              disabled={isSubmitting || isUploading}
              className="rounded flex-1"
            >
              {(isSubmitting || isUploading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isUploading
                ? "Caricamento..."
                : isSubmitting
                  ? "Creazione..."
                  : "Crea"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
