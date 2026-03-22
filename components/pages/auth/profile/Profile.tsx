"use client";

import { useEffect, useState } from "react";
import {
  User as UserIcon,
  Shield,
  KeyRound,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Mail,
  BadgeCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { getUserInitials } from "@/lib/utils";
import {
  fetchProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from "@/components/api/connectors/profileApi";
import { clearAuth } from "@/store/slices/authSlice";
import AppHeader from "@/components/layout/AppHeader";
import { toast } from "sonner";
import { setToast, TOAST_TYPE } from "@/components/ui/toast";

function ProfileSection({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className="rounded">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const {
    data: profile,
    isLoading,
    error,
    successMessage,
  } = useAppSelector((state) => state.profile);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [infoSaving, setInfoSaving] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePw, setShowDeletePw] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
    }
  }, [profile]);

  async function handleSaveInfo(e: React.FormEvent) {
    e.preventDefault();
    setInfoSaving(true);

    const result = await dispatch(
      updateProfile({ first_name: firstName, last_name: lastName }),
    );
    setInfoSaving(false);
    if (updateProfile.fulfilled.match(result)) {
      toast.success("Profilo aggiornato!", {
        description: "Le tue informazioni sono state salvate.",
      });
    } else {
      setToast({
        type: TOAST_TYPE.ERROR,
        title: "Errore",
        message: "Impossibile aggiornare il profilo.",
      });
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setToast({
        type: TOAST_TYPE.ERROR,
        title: "Errore",
        message: "Le password non coincidono.",
      });
      return;
    }
    if (newPassword.length < 8) {
      setToast({
        type: TOAST_TYPE.ERROR,
        title: "Errore",
        message: "La password deve essere lunga almeno 8 caratteri.",
      });
      return;
    }
    setPwSaving(true);
    const result = await dispatch(
      changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    );
    setPwSaving(false);
    if (changePassword.fulfilled.match(result)) {
      toast.success("Password aggiornata!", {
        description: "La tua password è stata cambiata con successo.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setToast({
        type: TOAST_TYPE.ERROR,
        title: "Errore",
        message:
          (result.payload as string) || "Impossibile cambiare la password.",
      });
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    const result = await dispatch(deleteAccount(deletePassword));
    setDeleting(false);
    if (deleteAccount.fulfilled.match(result)) {
      dispatch(clearAuth());
      router.push("/login");
    } else {
      setToast({
        type: TOAST_TYPE.ERROR,
        title: "Errore",
        message:
          (result.payload as string) || "Impossibile eliminare l'account.",
      });
    }
  }

  const displayUser = profile || user;

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50/50">
      <AppHeader user={user} />

      <div className="max-w-3xl mx-auto p-6 lg:p-8 space-y-8">
        <div className="flex items-end gap-4">
          <Avatar className="h-20 w-20 border-4 border-background shadow">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
              {displayUser ? getUserInitials(displayUser as any) : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="pb-1">
            <h2 className="text-2xl font-bold">
              {displayUser?.first_name} {displayUser?.last_name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Mail className="h-3.5 w-3.5" />
                {displayUser?.email}
              </span>
              {profile?.is_verified && (
                <Badge variant="secondary" className="gap-1 text-xs rounded">
                  <BadgeCheck className="h-3 w-3" />
                  Verificato
                </Badge>
              )}
            </div>
          </div>
        </div>

        <ProfileSection
          title="Informazioni Personali"
          icon={<UserIcon className="h-5 w-5 text-primary" />}
        >
          <form onSubmit={handleSaveInfo} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="first_name">Nome</Label>
                <Input
                  id="first_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="rounded"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name">Cognome</Label>
                <Input
                  id="last_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="rounded"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={displayUser?.email || ""}
                  disabled
                  className="pl-9 rounded bg-muted/40 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                L'email non può essere cambiata.
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="rounded gap-2"
                disabled={infoSaving}
              >
                <Save className="h-4 w-4" />
                {infoSaving ? "Salvataggio..." : "Salva"}
              </Button>
            </div>
          </form>
        </ProfileSection>

        {!profile?.oauth_provider && (
          <ProfileSection
            title="Sicurezza"
            icon={<KeyRound className="h-5 w-5 text-primary" />}
          >
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="current_password">Vecchia password</Label>
                <div className="relative">
                  <Input
                    id="current_password"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Inserisci vecchia password"
                    className="pr-10 rounded"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showCurrent ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="new_password">Nuova Password</Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimo 8 caratteri"
                    className="pr-10 rounded"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showNew ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm_password">
                  Conferma nuova password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Reinserisci nuova password"
                    className="pr-10 rounded"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="outline"
                  className="rounded gap-2"
                  disabled={pwSaving}
                >
                  <KeyRound className="h-4 w-4" />
                  {pwSaving ? "Aggiornamento..." : "Aggiorna"}
                </Button>
              </div>
            </form>
          </ProfileSection>
        )}

        {profile?.oauth_provider && (
          <Card className="rounded border-blue-100 bg-blue-50/50">
            <CardContent className="flex items-center gap-3 py-4">
              <Shield className="h-5 w-5 text-blue-500 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                Your account is linked via{" "}
                <span className="font-semibold capitalize">
                  {profile.oauth_provider}
                </span>
                . Password management is handled by your provider.
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="rounded border-destructive/30 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Elimina definitivamente il tuo account e tutti i dati associati.
              Questa azione non può essere annullata.
            </p>

            <Separator className="bg-red-200" />

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="rounded gap-2">
                  <Trash2 className="h-4 w-4" />
                  Elimina account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded">
                <AlertDialogHeader>
                  <AlertDialogTitle>Sei assolutamente sicuro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Questo eliminerà definitivamente il tuo account, tutte le
                    prenotazioni e qualsiasi dato associato ad esso. Questa
                    azione{" "}
                    <span className="font-semibold text-destructive">
                      non può essere annullata
                    </span>
                    .
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {!profile?.oauth_provider && (
                  <div className="space-y-1.5 py-2">
                    <Label htmlFor="delete_password">
                      Conferma la password
                    </Label>
                    <div className="relative">
                      <Input
                        id="delete_password"
                        type={showDeletePw ? "text" : "password"}
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Inserisci la password per confermare"
                        className="pr-10 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setShowDeletePw(!showDeletePw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showDeletePw ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                <AlertDialogFooter>
                  <AlertDialogCancel
                    className="rounded"
                    onClick={() => {
                      setDeletePassword("");
                    }}
                  >
                    Torna indietro
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded"
                    onClick={handleDeleteAccount}
                    disabled={
                      deleting || (!profile?.oauth_provider && !deletePassword)
                    }
                  >
                    {deleting ? "Eliminazione..." : "Elimina account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
