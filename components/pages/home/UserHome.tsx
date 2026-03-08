"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  User as UserIcon,
  LogOut,
  Search,
  Sparkles,
  TrendingUp,
  Clock,
  Star,
  Phone,
  ChevronRight,
  Building2,
  AlertCircle,
  X,
  Globe,
  Mail,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
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
import { User } from "@/lib/types/auth";
import { useRouter } from "next/navigation";
import { fetchSportsCenters } from "@/components/api/connectors/sportsCenterApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import AppHeader from "@/components/layout/AppHeader";

interface UserHomeProps {
  user: User;
}

export default function UserHome({ user }: UserHomeProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { sportsCenters, isLoading, error } = useAppSelector(
    (state) => state.sportsCenters,
  );

  const [selectedSport, setSelectedSport] = useState<SportType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showBecomeManagerModal, setShowBecomeManagerModal] = useState(false);

  useEffect(() => {
    dispatch(
      fetchSportsCenters({
        sport_type: selectedSport || undefined,
        search: searchQuery || undefined,
      }),
    );
  }, [dispatch, selectedSport, searchQuery]);

  const sports = [
    {
      type: SportType.FOOTBALL,
      label: "Calcio",
    },
    {
      type: SportType.PADEL,
      label: "Padel",
    },
    {
      type: SportType.TENNIS,
      label: "Tennis",
    },
    {
      type: SportType.BASKETBALL,
      label: "Basket",
    },
    {
      type: SportType.VOLLEYBALL,
      label: "Pallavolo",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50/50">
      <AppHeader user={user} />
      {/* Main Content */}
      <div className="max-w-400 mx-auto p-6 lg:p-8 space-y-8">
        <div className="relative mb-8 rounded overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&auto=format&fit=crop"
              alt="Sports background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8 lg:p-12">
            <h1 className="text-4xl font-bold tracking-tight mb-2 text-white">
              Trova il tuo campo perfetto
            </h1>
            <p className="text-white/90 text-lg mb-6">
              Prenota campi sportivi in pochi click. Semplice, veloce e sicuro.
            </p>

            {/* Search Bar */}
            <form className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cerca centri sportivi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white rounded"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Sport Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Scegli il tuo sport
            </h2>
            {selectedSport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSport(null)}
                className="rounded"
              >
                <X className="h-4 w-4 mr-2" />
                Mostra tutti
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {sports.map((sport) => {
              const sportImages = {
                [SportType.FOOTBALL]:
                  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&auto=format&fit=crop",
                [SportType.PADEL]:
                  "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&auto=format&fit=crop",
                [SportType.TENNIS]:
                  "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&auto=format&fit=crop",
                [SportType.BASKETBALL]:
                  "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop",
                [SportType.VOLLEYBALL]:
                  "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&auto=format&fit=crop",
              };

              return (
                <Card
                  key={sport.type}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md overflow-hidden group p-0 rounded",
                    selectedSport === sport.type &&
                      "ring-2 ring-primary shadow-md",
                  )}
                  onClick={() => setSelectedSport(sport.type)}
                >
                  <CardContent className="p-0">
                    <div className="relative h-36 overflow-hidden">
                      <img
                        src={sportImages[sport.type]}
                        alt={sport.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <span className="absolute bottom-2 left-0 right-0 text-center text-sm font-semibold text-white">
                        {sport.label}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Sports Centers List */}
        <div>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Centri Sportivi
          </h2>

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-32 w-full mb-4" />
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <p className="text-destructive mb-4">{error}</p>
                <Button
                  onClick={() => dispatch(fetchSportsCenters({}))}
                  variant="outline"
                >
                  Riprova
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Empty State */}
          {!isLoading && !error && sportsCenters.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Nessun centro trovato
                </h3>
                <p className="text-muted-foreground mb-4">
                  Prova a modificare i filtri di ricerca
                </p>
                {searchQuery && (
                  <Button onClick={() => setSearchQuery("")} variant="outline">
                    Cancella ricerca
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Sports Centers Grid */}
          {!isLoading && !error && sportsCenters.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sportsCenters.map((center) => (
                <Card
                  key={center._id}
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group p-0 rounded"
                  onClick={() => router.push(`/sports-centers/${center._id}`)}
                >
                  <CardContent className="p-0 flex flex-col h-full">
                    {/* Image/Logo Section */}
                    <div className="relative h-48 bg-muted">
                      {/* Background Image */}
                      <Image
                        src={
                          center?.images && center.images.length > 0
                            ? center.images[0]
                            : "https://images.unsplash.com/photo-1601868071295-70ae1bf49090?q=80&w=1112&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        }
                        alt={center.name}
                        fill
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40" />

                      {/* Logo Centered Bottom */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                        {center.logo_url && (
                          <div className="h-20 w-20 rounded-full border-4 border-background bg-background overflow-hidden shadow-lg">
                            <img
                              src={center.logo_url}
                              alt={center.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>

                      {/* Status Badge */}
                      <Badge
                        className="absolute top-3 right-3"
                        variant={
                          center.status === "active"
                            ? "default"
                            : center.status === "maintenance"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {center.status === "active"
                          ? "Attivo"
                          : center.status === "maintenance"
                            ? "Manutenzione"
                            : "Inattivo"}
                      </Badge>
                    </div>

                    {/* Content Section - flex-grow ensures button stays at bottom */}
                    <div className="p-6 pt-12 flex flex-col flex-grow">
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors text-center">
                          {center.name || "Centro Sportivo"}
                        </h3>

                        {center.description && (
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 text-center">
                            {center.description}
                          </p>
                        )}

                        {/* Contact Info */}
                        {center.contact_info && (
                          <div className="space-y-2 mb-4">
                            {center.contact_info.address && (
                              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-1">
                                  {center.contact_info.address}
                                </span>
                              </div>
                            )}
                            {center.contact_info.phone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="h-4 w-4 flex-shrink-0" />
                                <span>{center.contact_info.phone}</span>
                              </div>
                            )}
                            {center.contact_info.email && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 flex-shrink-0" />
                                <span className="line-clamp-1">
                                  {center.contact_info.email}
                                </span>
                              </div>
                            )}
                            {center.contact_info.website && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Globe className="h-4 w-4 flex-shrink-0" />
                                <span className="line-clamp-1">
                                  {center.contact_info.website}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* CTA Button - Always at the bottom */}
                      <Button className="w-full mt-4 rounded" variant="default">
                        Vedi Campi
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
