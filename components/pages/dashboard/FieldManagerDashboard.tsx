"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFields, deleteField } from "@/components/api/connectors/fieldApi";
import { fetchAllBookings } from "@/components/api/connectors/bookingApi";
import {
  fetchMySportsCenters,
  deleteSportsCenter,
} from "@/components/api/connectors/sportsCenterApi";
import { SportType, Field } from "@/lib/types/field";
import { User } from "@/lib/types/auth";
import CreateSportsCenterModal from "@/components/modals/CreateSportsCenterModal";
import CreateFieldModal from "@/components/modals/CreateFieldModal";
import EditFieldModal from "@/components/modals/EditFieldModal";
import ManageAvailabilityModal from "@/components/modals/ManageAvailabilityModal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Plus,
  Phone,
  MapPin,
  Trash2,
  Edit2,
  Calendar,
  DollarSign,
  User as UserIcon,
  LogOut,
  Settings,
  Users,
  Loader2,
  CheckCheckIcon,
  CheckIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getUserInitials } from "@/lib/utils";
import AppHeader from "@/components/layout/AppHeader";
import { SportsCenter } from "@/lib/types/sports_center";
import EditSportsCenterModal from "@/components/modals/EditSportsCenterModal";

interface FieldManagerDashboardProps {
  user: User;
}

export default function FieldManagerDashboard({
  user,
}: FieldManagerDashboardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { fields, isLoading: fieldsLoading } = useAppSelector(
    (state) => state.fields,
  );
  const { sportsCenters, isLoading: centersLoading } = useAppSelector(
    (state) => state.sportsCenters,
  );
  const { bookings } = useAppSelector((state) => state.bookings);

  const [isCreateCenterModalOpen, setIsCreateCenterModalOpen] = useState(false);
  const [isCreateFieldModalOpen, setIsCreateFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<Field | null>(null);
  const [managingAvailabilityField, setManagingAvailabilityField] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [editingCenter, setEditingCenter] = useState<SportsCenter | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    type: "center" | "field";
    id: string;
    name: string;
  }>({ isOpen: false, type: "center", id: "", name: "" });

  useEffect(() => {
    dispatch(fetchMySportsCenters());
    dispatch(fetchFields({}));
    dispatch(fetchAllBookings({}));
  }, [dispatch]);

  const handleDeleteSportsCenter = async (centerId: string) => {
    setDeleting(centerId);
    try {
      await dispatch(deleteSportsCenter(centerId)).unwrap();
      setDeleteDialog({ isOpen: false, type: "center", id: "", name: "" });
    } catch (error: any) {
      alert(error || "Failed to delete sports center");
    } finally {
      setDeleting(null);
    }
  };

  const handleDeleteField = async (fieldId: string) => {
    setDeleting(fieldId);
    try {
      await dispatch(deleteField(fieldId)).unwrap();
      setDeleteDialog({ isOpen: false, type: "field", id: "", name: "" });
    } catch (error: any) {
      alert(error || "Failed to delete field");
    } finally {
      setDeleting(null);
    }
  };

  const activeFields = fields.filter((f) => f.is_active);
  const totalRevenue = bookings.reduce((sum, b) => sum + b.total_price, 0);

  const statsData = [
    {
      title: "Centri Sportivi",
      value: sportsCenters.length,
      icon: Building2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Campi Attivi",
      value: activeFields.length,
      icon: Users,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Prenotazioni Totali",
      value: bookings.length,
      icon: Calendar,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
    },
    {
      title: "Ricavi Totali",
      value: `€${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      <AppHeader user={user} />
      <div className="max-w-400 mx-auto p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Ciao {user.first_name}!
          </h1>
          <p className="text-slate-600 text-sm">
            Benvenuto nella tua dashboard. Qui puoi gestire centri sportivi,
            campi e prenotazioni.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="border border-gray-100 bg-white rounded hover:border-gray-200 transition-all duration-300 py-4 cursor-pointer"
              >
                <CardContent>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-gray-100 p-2 rounded-lg">
                      <Icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <p className="text-sm text-gray-500 font-medium">
                      {stat.title}
                    </p>
                  </div>
                  <div className="pl-1 space-y-1">
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <div className="flex justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              Centri Sportivi
            </h1>
            <Button
              onClick={() => setIsCreateCenterModalOpen(true)}
              className="rounded bg-slate-900 hover:bg-slate-800"
            >
              <Plus className="w-4 h-4" />
              Aggiungi Centro
            </Button>
          </div>
          {centersLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
              <p className="mt-4 text-slate-600">
                Caricamento centri sportivi...
              </p>
            </div>
          ) : sportsCenters.length === 0 ? (
            <Card className="border shadow-sm">
              <CardContent className="p-16">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="bg-slate-100 p-4 rounded-full mb-4">
                    <Building2 className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium">
                    Nessun centro sportivo ancora
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    Crea il tuo primo centro per iniziare!
                  </p>
                  <Button
                    onClick={() => setIsCreateCenterModalOpen(true)}
                    className="mt-4 bg-slate-900 hover:bg-slate-800"
                  >
                    <Plus className="w-4 h-4" />
                    Aggiungi Centro Sportivo
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            sportsCenters.map((center) => (
              <Card
                key={center._id}
                className="border border-gray-100 bg-white rounded hover:border-gray-200 transition-all duration-300 py-4 cursor-pointer overflow-hidden"
              >
                {/* Center Header */}
                <CardHeader className="border-b bg-slate-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {center.logo_url && (
                        <Image
                          src={center.logo_url}
                          alt={`${center.name} logo`}
                          width={80}
                          height={80}
                          className="w-20 h-20 object-contain rounded-md border bg-white p-2"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl font-semibold text-slate-900">
                            {center.name}
                          </CardTitle>
                        </div>
                        {center.description && (
                          <CardDescription className="text-sm">
                            {center.description}
                          </CardDescription>
                        )}
                        {center.contact_info && (
                          <div className="mt-3 space-y-2">
                            {center.contact_info.phone && (
                              <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Phone className="w-4 h-4 text-slate-400" />
                                {center.contact_info.phone}
                              </div>
                            )}
                            {center.contact_info.address && (
                              <div className="flex items-start gap-2 text-sm text-slate-600">
                                <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                <span className="break-words">
                                  {center.contact_info.address}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateFieldModalOpen(true)}
                        className="rounded"
                      >
                        <Plus className="w-4 h-4" />
                        Aggiungi
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditingCenter(center)}
                        className="rounded group/btn"
                      >
                        <Edit2 className="w-4 h-4" />
                        Modifica
                      </Button>{" "}
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setDeleteDialog({
                            isOpen: true,
                            type: "center",
                            id: center._id,
                            name: center.name,
                          })
                        }
                        disabled={deleting === center._id}
                        className="rounded text-red-600 hover:text-red-700 border border-red-300 hover:bg-red-50"
                      >
                        {deleting === center._id ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            Elimina
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Center Fields */}
                <CardContent className="px-6">
                  <h1 className="text-2xl mb-4 font-semibold tracking-tight text-slate-900">
                    Campi
                  </h1>
                  {fieldsLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                      <p className="mt-4 text-slate-600">
                        Caricamento campi...
                      </p>
                    </div>
                  ) : fields.filter((f) => f.sports_center_id === center._id)
                      .length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="bg-slate-100 p-4 rounded-full mb-4">
                        <Users className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-600 font-medium">
                        Nessun campo ancora
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Aggiungi il tuo primo campo a questo centro!
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {fields
                        .filter((f) => f.sports_center_id === center._id)
                        .map((field) => {
                          return (
                            <Card
                              key={field._id}
                              className="border border-gray-100 bg-white rounded hover:border-gray-200 transition-all duration-300 p-0 overflow-hidden cursor-pointer"
                            >
                              <div className="relative h-40 overflow-hidden bg-muted">
                                <Image
                                  src={
                                    field.image_url ??
                                    "https://images.unsplash.com/photo-1601868071295-70ae1bf49090?q=80&w=1112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                  }
                                  alt={`${field.name}`}
                                  width={400}
                                  height={160}
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                <Badge
                                  variant="secondary"
                                  className={`absolute top-3 right-3 ${
                                    field.is_active
                                      ? "bg-emerald-500 text-white"
                                      : "bg-slate-500 text-white"
                                  }`}
                                >
                                  {field.is_active ? "Attivo" : "Inattivo"}
                                </Badge>
                              </div>

                              <CardContent className="px-4 pb-4 flex flex-col h-38">
                                <div className="mb-4">
                                  <div className="flex justify-between">
                                    <h3 className="font-semibold text-lg text-foreground line-clamp-1">
                                      {field.name}
                                    </h3>
                                    <div className="flex items-baseline gap-1">
                                      <span className="text-xl font-semibold text-foreground">
                                        €{field.hourly_rate.toFixed(2)}
                                      </span>
                                      <span className="text-sm text-muted-foreground">
                                        /ora
                                      </span>
                                    </div>
                                  </div>
                                  {field.description && (
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                      {field.description}
                                    </p>
                                  )}
                                </div>
                                <div className="space-y-2 mt-auto">
                                  <div className="grid grid-cols-2 gap-2">
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setManagingAvailabilityField({
                                          id: field._id,
                                          name: field.name,
                                        })
                                      }
                                      className="h-8 rounded"
                                    >
                                      <Calendar className="w-4 h-4" />
                                      Disponibilità
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => setEditingField(field)}
                                      className="h-8 rounded"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                      Modifica
                                    </Button>
                                  </div>

                                  <Button
                                    variant="ghost"
                                    onClick={() =>
                                      setDeleteDialog({
                                        isOpen: true,
                                        type: "field",
                                        id: field._id,
                                        name: field.name,
                                      })
                                    }
                                    disabled={deleting === field._id}
                                    className="rounded h-8 w-full text-destructive hover:text-destructive hover:bg-destructive/10 border border-red-300"
                                  >
                                    {deleting === field._id ? (
                                      <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Eliminazione...
                                      </>
                                    ) : (
                                      <>
                                        <Trash2 className="w-4 h-4" />
                                        Elimina
                                      </>
                                    )}
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateSportsCenterModal
        isOpen={isCreateCenterModalOpen}
        onClose={() => setIsCreateCenterModalOpen(false)}
      />

      <CreateFieldModal
        isOpen={isCreateFieldModalOpen}
        onClose={() => setIsCreateFieldModalOpen(false)}
      />

      {editingField && (
        <EditFieldModal
          field={editingField}
          isOpen={!!editingField}
          onClose={() => setEditingField(null)}
        />
      )}

      {editingCenter && (
        <EditSportsCenterModal
          isOpen={!!editingCenter}
          onClose={() => setEditingCenter(null)}
          sportsCenter={editingCenter}
        />
      )}

      {managingAvailabilityField && (
        <ManageAvailabilityModal
          fieldId={managingAvailabilityField.id}
          fieldName={managingAvailabilityField.name}
          isOpen={!!managingAvailabilityField}
          onClose={() => setManagingAvailabilityField(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(open) =>
          !open &&
          setDeleteDialog({ isOpen: false, type: "center", id: "", name: "" })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei assolutamente sicuro?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteDialog.type === "center"
                ? `Questa azione eliminerà definitivamente il centro sportivo "${deleteDialog.name}" e tutti i campi associati. Questa azione non può essere annullata.`
                : `Questa azione eliminerà definitivamente il campo "${deleteDialog.name}". Questa azione non può essere annullata.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deleting} className="rounded">
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteDialog.type === "center"
                  ? handleDeleteSportsCenter(deleteDialog.id)
                  : handleDeleteField(deleteDialog.id)
              }
              disabled={!!deleting}
              className="bg-red-600 hover:bg-red-700 rounded"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Eliminazione in corso...
                </>
              ) : (
                "Elimina"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
