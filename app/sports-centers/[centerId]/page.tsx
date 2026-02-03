"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  ArrowLeft,
  Clock,
  Euro,
  AlertCircle,
  UserIcon,
  LogOut,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSportsCenterById } from "@/components/api/connectors/sportsCenterApi";
import { fetchFields } from "@/components/api/connectors/fieldApi";
import { SportType } from "@/lib/types/field";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUserInitials } from "@/lib/utils";
import Image from "next/image";

export default function SportsCenterDetailPage() {
  const { user } = useAppSelector((state) => state.auth);
  const params = useParams();

  const centerId = params.centerId as string;
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { selectedSportsCenter, isLoading: centerLoading } = useAppSelector(
    (state) => state.sportsCenters,
  );
  const { fields, isLoading: fieldsLoading } = useAppSelector(
    (state) => state.fields,
  );

  useEffect(() => {
    dispatch(fetchSportsCenterById(centerId));
  }, [dispatch, centerId]);

  useEffect(() => {
    if (selectedSportsCenter) {
      dispatch(fetchFields({}));
    }
  }, [dispatch, selectedSportsCenter]);

  const centerFields = fields.filter(
    (field) => field.sports_center_id === centerId,
  );

  const sportTypeLabels: Record<SportType, string> = {
    [SportType.FOOTBALL]: "Calcio",
    [SportType.PADEL]: "Padel",
    [SportType.TENNIS]: "Tennis",
    [SportType.BASKETBALL]: "Basket",
    [SportType.VOLLEYBALL]: "Pallavolo",
  };

  const handleBookField = (centerId: string, fieldId: string) => {
    router.push(`/sports-centers/${centerId}/${fieldId}/book`);
  };

  if (centerLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
        <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
          <Skeleton className="h-12 w-48" />
          <Card>
            <CardContent className="p-8">
              <Skeleton className="h-32 w-32 rounded-full mx-auto mb-6" />
              <Skeleton className="h-8 w-64 mx-auto mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!selectedSportsCenter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50 flex items-center justify-center">
        <Card className="border-destructive">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <p className="text-destructive mb-4">Centro sportivo non trovato</p>
            <Button onClick={() => router.back()} variant="outline">
              Torna indietro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50/50">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo and Name */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-xl font-bold">C</span>
            </div>
            <span className="text-xl font-semibold">
              {selectedSportsCenter.name}
            </span>
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-end gap-3 px-3 min-w-40 focus:outline-none focus:ring-0 focus-visible:ring-0 focus:bg-transparent"
              >
                <span className="hidden md:block text-sm font-medium">
                  {user?.first_name} {user?.last_name}
                </span>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded shadow-sm">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
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
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push("/my-bookings")}
              >
                <Calendar className="mr-2 h-4 w-4" />
                <span>Le Mie Prenotazioni</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/logout")}
                className="text-red-500 hover:bg-gray-50 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4 text-red-500" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Sports Center Details */}
        <Card className="border border-gray-100 bg-white rounded hover:border-gray-200 transition-all duration-300 py-4 cursor-pointer overflow-hidden p-0">
          <div className="relative h-64 bg-gradient-to-r from-primary/20 to-primary/10">
            <img
              src="https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&auto=format&fit=crop"
              alt="Sports center background"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />

            {/* Logo */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              {selectedSportsCenter.logo_url ? (
                <div className="h-32 w-32 rounded-full border-4 border-background bg-background overflow-hidden shadow-lg">
                  <img
                    src={selectedSportsCenter.logo_url}
                    alt={selectedSportsCenter.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-32 w-32 rounded-full border-4 border-background bg-primary flex items-center justify-center shadow-lg">
                  <span className="text-4xl font-bold text-primary-foreground">
                    {selectedSportsCenter.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Status Badge */}
            <Badge
              className="absolute top-4 right-4"
              variant={
                selectedSportsCenter.status === "active"
                  ? "default"
                  : selectedSportsCenter.status === "maintenance"
                    ? "secondary"
                    : "outline"
              }
            >
              {selectedSportsCenter.status === "active"
                ? "Attivo"
                : selectedSportsCenter.status === "maintenance"
                  ? "Manutenzione"
                  : "Inattivo"}
            </Badge>
          </div>

          <CardContent className="pt-20 pb-8 px-8">
            {/* Center Name */}
            <h1 className="text-4xl font-bold text-center mb-4">
              {selectedSportsCenter.name}
            </h1>

            {/* Description */}
            {selectedSportsCenter.description && (
              <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
                {selectedSportsCenter.description}
              </p>
            )}

            {/* Contact Information */}
            {selectedSportsCenter.contact_info && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {selectedSportsCenter.contact_info.address && (
                  <div className="flex items-start gap-3 p-4 rounded bg-muted/50">
                    <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1">Indirizzo</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedSportsCenter.contact_info.address}
                      </p>
                    </div>
                  </div>
                )}

                {selectedSportsCenter.contact_info.phone && (
                  <div className="flex items-start gap-3 p-4 rounded bg-muted/50">
                    <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1">Telefono</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedSportsCenter.contact_info.phone}
                      </p>
                    </div>
                  </div>
                )}

                {selectedSportsCenter.contact_info.email && (
                  <div className="flex items-start gap-3 p-4 rounded bg-muted/50">
                    <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1">Email</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedSportsCenter.contact_info.email}
                      </p>
                    </div>
                  </div>
                )}

                {selectedSportsCenter.contact_info.website && (
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <Globe className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium mb-1">Sito Web</p>
                      <a
                        href={selectedSportsCenter.contact_info.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {selectedSportsCenter.contact_info.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fields Section */}
        <div>
          <h2 className="text-2xl font-semibold text-center mb-6">
            Campi Disponibili
          </h2>

          {fieldsLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : centerFields.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Nessun campo disponibile al momento
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {centerFields.map((field) => (
                <Card
                  key={field._id}
                  className="border border-gray-100 bg-white rounded hover:border-gray-200 transition-all duration-300 p-0 overflow-hidden cursor-pointer group"
                >
                  <div className="relative h-40 overflow-hidden bg-muted">
                    <Image
                      src="https://images.unsplash.com/photo-1601868071295-70ae1bf49090?q=80&w=1112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
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
                    {/* Sport Type Badge */}
                    <Badge
                      variant="outline"
                      className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm border-white/50 text-foreground font-medium shadow-lg"
                    >
                      {sportTypeLabels[field.sport_type]}
                    </Badge>
                  </div>

                  <CardContent className="px-4 pb-4 flex flex-col h-28">
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
                      <Button
                        variant="outline"
                        className="w-full h-8 rounded"
                        onClick={() => handleBookField(centerId, field._id)}
                        disabled={!field.is_active}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Prenota
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
