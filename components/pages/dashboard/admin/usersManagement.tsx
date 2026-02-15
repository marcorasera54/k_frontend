"use client";

import { useState, useEffect, useMemo } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import api from "@/components/api/api";
import EditUserDialog from "./editUserDialog";
import DeleteUserDialog from "./deleteUserDialog";

interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users/");
      setUsers(response.data);
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.first_name.toLowerCase() ||
        user.last_name.toLowerCase() ||
        user.email.toLowerCase() ||
        user.role.toLowerCase(),
    );
  }, [users]);

  const getRoleBadge = (role: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      administrator: "destructive",
      manager: "default",
      customer: "secondary",
    };
    return (
      <Badge
        variant={variants[role] || "outline"}
        className="capitalize rounded"
      >
        {role}
      </Badge>
    );
  };

  const handleUserUpdated = () => {
    fetchUsers();
    setEditingUser(null);
  };

  const handleUserDeleted = () => {
    fetchUsers();
    setDeletingUser(null);
  };

  if (loading) {
    return (
      <div>
        <h1 className="font-semibold text-lg">Caricamento...</h1>
      </div>
    );
  }

  return (
    <>
      <div>
        <div>
          <h1 className="font-semibold">Gestione Utenti</h1>
          <p className="py-2">Visualizza e gestisci tutti gli utenti</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              Nessun utente trovato
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="rounded border text-card-foreground"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {user.first_name} {user.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="rounded shadow-sm"
                        align="end"
                      >
                        <DropdownMenuItem onClick={() => setEditingUser(user)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifica
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeletingUser(user)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-red-600" />
                          Elimina
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Ruolo
                      </span>
                      {getRoleBadge(user.role)}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Stato
                      </span>
                      {user.is_active ? (
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 rounded"
                        >
                          Attivo
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-red-50 text-red-700 border-red-200 rounded"
                        >
                          Inattivo
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Verifica
                      </span>
                      {user.is_verified ? (
                        <Badge
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 rounded"
                        >
                          Verificato
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="rounded">
                          Non verificato
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm text-muted-foreground">
                        Registrato
                      </span>
                      <span className="text-sm">
                        {new Date(user.created_at).toLocaleDateString("it-IT")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          onUserUpdated={handleUserUpdated}
        />
      )}

      {deletingUser && (
        <DeleteUserDialog
          user={deletingUser}
          open={!!deletingUser}
          onOpenChange={(open) => !open && setDeletingUser(null)}
          onUserDeleted={handleUserDeleted}
        />
      )}
    </>
  );
}
