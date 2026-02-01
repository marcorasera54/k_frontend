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
import { Loader2, AlertCircle } from "lucide-react";

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
  const { sportsCenters } = useAppSelector((state) => state.sportsCenters);

  useEffect(() => {
    dispatch(fetchMySportsCenters());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await dispatch(
        createField({
          ...formData,
          hourly_rate: parseFloat(formData.hourly_rate),
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
    } catch (err: any) {
      setError(err || "Failed to create field");
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create New Field
          </DialogTitle>
          <DialogDescription>
            Add a new field to one of your sports centers. All fields marked
            with * are required.
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
              Sports Center <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.sports_center_id}
              onValueChange={(value) =>
                setFormData({ ...formData, sports_center_id: value })
              }
              required
            >
              <SelectTrigger id="sports_center_id">
                <SelectValue placeholder="Select a sports center" />
              </SelectTrigger>
              <SelectContent>
                {sportsCenters.length === 0 ? (
                  <div className="px-2 py-6 text-center text-sm text-slate-500">
                    No sports centers available
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
                Please create a sports center first
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">
              Field Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Main Football Field"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sport_type">
              Sport Type <span className="text-red-500">*</span>
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
              <SelectTrigger id="sport_type">
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
              Hourly Rate ($) <span className="text-red-500">*</span>
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
              placeholder="e.g., 50.00"
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
              placeholder="Optional description of the field..."
              className="resize-none"
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
              Field is active and available for booking
            </Label>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || sportsCenters.length === 0}
              className="bg-slate-900 hover:bg-slate-800"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Field"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
