"use client";

import { useEffect, useState } from "react";
import {
  User as UserIcon,
  LogOut,
  ChevronLeft,
  Shield,
  KeyRound,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Save,
  Mail,
  Phone,
  FileText,
  BadgeCheck,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Textarea } from "@/components/ui/textarea";
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
import { clearProfileMessages } from "@/store/slices/profileSlice";
import { clearAuth } from "@/store/slices/authSlice";
import { logoutUser } from "@/components/api/connectors/authApi";
import { cn } from "@/lib/utils";

function FeedbackBanner({
  type,
  message,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded p-3 text-sm",
        type === "success"
          ? "bg-green-50 text-green-800 border border-green-200"
          : "bg-red-50 text-red-800 border border-red-200",
      )}
    >
      {type === "success" ? (
        <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
      ) : (
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
      )}
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="text-current opacity-60 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}

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
      <CardHeader className="pb-4">
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
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [infoSaving, setInfoSaving] = useState(false);
  const [infoFeedback, setInfoFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwFeedback, setPwFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePw, setShowDeletePw] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteFeedback, setDeleteFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setPhone(profile.phone || "");
      setBio(profile.bio || "");
    }
  }, [profile]);

  async function handleSaveInfo(e: React.FormEvent) {
    e.preventDefault();
    setInfoSaving(true);
    setInfoFeedback(null);
    const result = await dispatch(
      updateProfile({ first_name: firstName, last_name: lastName, phone, bio }),
    );
    setInfoSaving(false);
    if (updateProfile.fulfilled.match(result)) {
      setInfoFeedback({
        type: "success",
        message: "Profile updated successfully.",
      });
    } else {
      setInfoFeedback({
        type: "error",
        message: (result.payload as string) || "Failed to update profile.",
      });
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwFeedback(null);
    if (newPassword !== confirmPassword) {
      setPwFeedback({ type: "error", message: "New passwords do not match." });
      return;
    }
    if (newPassword.length < 8) {
      setPwFeedback({
        type: "error",
        message: "Password must be at least 8 characters.",
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
      setPwFeedback({
        type: "success",
        message: "Password changed successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPwFeedback({
        type: "error",
        message: (result.payload as string) || "Failed to change password.",
      });
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    setDeleteFeedback(null);
    const result = await dispatch(deleteAccount(deletePassword));
    setDeleting(false);
    if (deleteAccount.fulfilled.match(result)) {
      dispatch(clearAuth());
      router.push("/login");
    } else {
      setDeleteFeedback({
        type: "error",
        message: (result.payload as string) || "Failed to delete account.",
      });
    }
  }

  async function handleLogout() {
    await dispatch(logoutUser());
    dispatch(clearAuth());
    router.push("/login");
  }

  const displayUser = profile || user;

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-xl font-bold">C</span>
            </div>
            <span className="text-xl font-semibold hidden sm:block">
              Profile
            </span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-end gap-3 px-3 min-w-40 focus:outline-none focus:ring-0 focus-visible:ring-0 focus:bg-transparent"
              >
                <span className="hidden md:block text-sm font-medium">
                  {displayUser?.first_name} {displayUser?.last_name}
                </span>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {displayUser ? getUserInitials(displayUser as any) : "?"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded shadow-sm">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {displayUser?.first_name} {displayUser?.last_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {displayUser?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push("/profile")}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-500 hover:bg-gray-50 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4 text-red-500" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

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
                  Verified
                </Badge>
              )}
              {profile?.role && (
                <Badge variant="outline" className="text-xs rounded capitalize">
                  {profile.role}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <ProfileSection
          title="Personal Information"
          icon={<UserIcon className="h-5 w-5 text-primary" />}
        >
          <form onSubmit={handleSaveInfo} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="rounded"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
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
                Email cannot be changed.
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+39 000 000 0000"
                  className="pl-9 rounded"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a bit about yourself..."
                  rows={3}
                  className="pl-9 rounded resize-none"
                />
              </div>
            </div>

            {infoFeedback && (
              <FeedbackBanner
                type={infoFeedback.type}
                message={infoFeedback.message}
                onClose={() => setInfoFeedback(null)}
              />
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                className="rounded gap-2"
                disabled={infoSaving}
              >
                <Save className="h-4 w-4" />
                {infoSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </ProfileSection>

        {!profile?.oauth_provider && (
          <ProfileSection
            title="Security"
            icon={<KeyRound className="h-5 w-5 text-primary" />}
          >
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="current_password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current_password"
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
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
                <Label htmlFor="new_password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
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
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
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

              {pwFeedback && (
                <FeedbackBanner
                  type={pwFeedback.type}
                  message={pwFeedback.message}
                  onClose={() => setPwFeedback(null)}
                />
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="outline"
                  className="rounded gap-2"
                  disabled={pwSaving}
                >
                  <Shield className="h-4 w-4" />
                  {pwSaving ? "Updating..." : "Update Password"}
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

        <Card className="rounded border-destructive/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <Trash2 className="h-5 w-5" />
              Danger Zone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>

            <Separator />

            {deleteFeedback && (
              <FeedbackBanner
                type={deleteFeedback.type}
                message={deleteFeedback.message}
                onClose={() => setDeleteFeedback(null)}
              />
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="rounded gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="rounded">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your account, all bookings, and
                    any data associated with it. This action{" "}
                    <span className="font-semibold text-destructive">
                      cannot be undone
                    </span>
                    .
                  </AlertDialogDescription>
                </AlertDialogHeader>

                {!profile?.oauth_provider && (
                  <div className="space-y-1.5 py-2">
                    <Label htmlFor="delete_password">
                      Confirm your password
                    </Label>
                    <div className="relative">
                      <Input
                        id="delete_password"
                        type={showDeletePw ? "text" : "password"}
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="Enter your password to confirm"
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
                      setDeleteFeedback(null);
                    }}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded"
                    onClick={handleDeleteAccount}
                    disabled={
                      deleting || (!profile?.oauth_provider && !deletePassword)
                    }
                  >
                    {deleting ? "Deleting..." : "Delete my account"}
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
