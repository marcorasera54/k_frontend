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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, AlertCircle } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
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

      alert("Field updated successfully!");
      onClose();
    } catch (err: any) {
      setError(err || "Failed to update field");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Field</DialogTitle>
          <DialogDescription>
            Update the details of your sports field
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sports_center">
              Sports Center <span className="text-destructive">*</span>
            </Label>
            <Select
              required
              value={formData.sports_center_id}
              onValueChange={(value) =>
                setFormData({ ...formData, sports_center_id: value })
              }
            >
              <SelectTrigger id="sports_center">
                <SelectValue placeholder="Select sports center" />
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
              Field Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="field_name"
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sport_type">
              Sport Type <span className="text-destructive">*</span>
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
              <SelectTrigger id="sport_type">
                <SelectValue placeholder="Select sport type" />
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
              Hourly Rate ($) <span className="text-destructive">*</span>
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
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
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
              Field is active and available for booking
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Updating..." : "Update Field"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
