"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/components/api/api";
import { Toast } from "@/components/ui/toast";

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface DeleteUserDialogProps {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserDeleted: () => void;
}

export default function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onUserDeleted,
}: DeleteUserDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      await api.delete(`/users/${user._id}`);
      onUserDeleted();
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Elimina Utente</DialogTitle>
          <DialogDescription>
            Questa azione non può essere annullata. L'utente{" "}
            <strong>
              {user.first_name} {user.last_name}
            </strong>{" "}
            ({user.email}) sarà eliminato permanentemente.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="rounded"
          >
            Annulla
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="rounded"
          >
            {loading ? "Eliminazione..." : "Elimina"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
