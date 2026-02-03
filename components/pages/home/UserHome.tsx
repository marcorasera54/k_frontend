"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  User as UserIcon,
  LogOut,
  Search,
  X,
  Phone,
  Globe,
  Mail,
  AlertCircle,
  ChevronRight,
  Building2,
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
import { User, UserRole } from "@/lib/types/auth";
import { useRouter } from "next/navigation";
import { fetchSportsCenters } from "@/components/api/connectors/sportsCenterApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

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
    <div className="w-full min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo and Name */}
          <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => router.push("/")}>
            <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-sm">
              <Image
                src="/images/logo.jpg"
                alt="SpotField Logo"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              SpotField
            </span>
          </div>

          {/* Search Bar - Centered */}
          <div className="flex-1 max-w-xl mx-4 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                type="search"
                placeholder="Cerca centri sportivi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 w-full bg-slate-100 border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/10 rounded-2xl transition-all"
              />
            </div>
          </div>

          {/* Mobile Search Icon (only visible on small screens) */}
          <Button variant="ghost" size="icon" className="md:hidden rounded-full">
            <Search className="h-5 w-5 text-slate-600" />
          </Button>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 pl-2 pr-1 rounded-full hover:bg-slate-100 focus:ring-0 focus:ring-offset-0"
              >
                <div className="hidden sm:flex flex-col items-end mr-1">
                  <span className="text-sm font-semibold text-slate-700 leading-none">
                    {user.first_name}
                  </span>
                </div>
                <Avatar className="h-9 w-9 border-2 border-white shadow-sm ring-1 ring-slate-200">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-medium">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-lg border-slate-100 p-2">
              <DropdownMenuLabel className="px-2 py-1.5">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold text-slate-900">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs text-slate-500 font-normal">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="-mx-1 my-1" />
              <DropdownMenuItem
                className="rounded-xl px-2 py-2 cursor-pointer hover:bg-slate-50 text-slate-600 focus:bg-blue-50 focus:text-blue-700"
                onClick={() => router.push("/profile")}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profilo</span>
              </DropdownMenuItem>
              {user.role === UserRole.ADMIN && (
                <DropdownMenuItem
                  className="rounded-xl px-2 py-2 cursor-pointer hover:bg-slate-50 text-slate-600 focus:bg-blue-50 focus:text-blue-700"
                  onClick={() => router.push("/admin/requests")}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  <span>Gestione Richieste</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => router.push("/logout")}
                className="rounded-xl px-2 py-2 cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 focus:text-red-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Disconnetti</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

        {/* Banner Section */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[300px] md:h-[400px]">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1551958219-acbc608c6377?w=1200&auto=format&fit=crop"
              alt="Sports background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/40 to-transparent" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-12 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4 drop-shadow-sm">
              Trova il tuo <br />
              <span className="text-blue-400">Campo Perfetto</span>
            </h1>
            <p className="text-blue-100 text-lg md:text-xl font-medium max-w-xl leading-relaxed">
              Prenota campi sportivi in pochi click. <br className="hidden md:block" />
              Semplice, veloce e sicuro con SpotField.
            </p>
          </div>
        </div>

        {/* Sport Selection */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Scegli il tuo sport
            </h2>
            {selectedSport && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSport(null)}
                className="rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              >
                <X className="h-4 w-4 mr-1" />
                Mostra tutti
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {sports.map((sport) => {
              const sportImages = {
                [SportType.FOOTBALL]: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80",
                [SportType.PADEL]: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&q=80",
                [SportType.TENNIS]: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&q=80",
                [SportType.BASKETBALL]: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80",
                [SportType.VOLLEYBALL]: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&q=80",
              };

              const isSelected = selectedSport === sport.type;

              return (
                <div
                  key={sport.type}
                  className={cn(
                    "group relative cursor-pointer rounded-2xl overflow-hidden aspect-[4/3] transition-all duration-300",
                    isSelected ? "ring-4 ring-blue-500 ring-offset-2 scale-105 shadow-xl" : "hover:scale-105 hover:shadow-lg"
                  )}
                  onClick={() => setSelectedSport(sport.type)}
                >
                  <Image
                    src={sportImages[sport.type]}
                    alt={sport.label}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={cn(
                    "absolute inset-0 transition-colors duration-300 flex items-center justify-center",
                    isSelected ? "bg-blue-600/60" : "bg-black/30 group-hover:bg-black/40"
                  )}>
                    <span className="text-white font-bold text-lg tracking-wide transform group-hover:scale-110 transition-transform">
                      {sport.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Sports Centers List */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Centri Disponibili
            </h2>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-full text-xs">
              {sportsCenters.length} risultati
            </Badge>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="border-0 shadow-sm rounded-3xl overflow-hidden">
                  <CardContent className="p-0">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-6 w-3/4 rounded-lg" />
                      <Skeleton className="h-4 w-1/2 rounded-lg" />
                      <Skeleton className="h-10 w-full rounded-xl mt-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center max-w-lg mx-auto">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-900 mb-2">Ops, qualcosa è andato storto</h3>
              <p className="text-red-600 mb-6">{error}</p>
              <Button
                onClick={() => dispatch(fetchSportsCenters({}))}
                variant="outline"
                className="bg-white border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 rounded-xl"
              >
                Riprova
              </Button>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && sportsCenters.length === 0 && (
            <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center max-w-lg mx-auto shadow-sm">
              <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Nessun centro trovato
              </h3>
              <p className="text-slate-500 mb-6 max-w-xs mx-auto">
                Non abbiamo trovato centri che corrispondano alla tua ricerca. Prova a cambiare filtri.
              </p>
              {searchQuery && (
                <Button onClick={() => setSearchQuery("")} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">
                  Mostra tutto
                </Button>
              )}
            </div>
          )}

          {/* Sports Centers Grid */}
          {!isLoading && !error && sportsCenters.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {sportsCenters.map((center) => (
                <div
                  key={center._id}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 cursor-pointer flex flex-col h-full"
                  onClick={() => router.push(`/sports-centers/${center._id}`)}
                >
                  {/* Image Header */}
                  <div className="relative h-56 overflow-hidden bg-slate-100">
                    <Image
                      src="https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800&q=80"
                      alt="Center cover"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                    <Badge
                      className={cn(
                        "absolute top-4 right-4 backdrop-blur-md px-3 py-1 text-xs font-medium border-0 shadow-sm",
                        center.status === "active" ? "bg-green-500/90 text-white" : "bg-slate-500/90 text-white"
                      )}
                    >
                      {center.status === "active" ? "Aperto" : "Non disponibile"}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1 relative">
                    {/* Logo Overlay */}
                    <div className="absolute -top-10 left-6">
                      <div className="h-20 w-20 rounded-2xl border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
                        {center.logo_url ? (
                          <img
                            src={center.logo_url}
                            alt={center.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 className="h-8 w-8 text-blue-300" />
                        )}
                      </div>
                    </div>

                    <div className="mt-10 mb-4">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2 line-clamp-1">
                        {center.name || "Centro Sportivo"}
                      </h3>
                      {center.description && (
                        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
                          {center.description}
                        </p>
                      )}
                    </div>

                    {/* Info */}
                    <div className="space-y-3 mb-6 mt-auto">
                      {center.contact_info?.address && (
                        <div className="flex items-start gap-3 text-sm text-slate-600">
                          <div className="bg-blue-50 p-1.5 rounded-lg shrink-0 text-blue-600">
                            <MapPin className="h-3.5 w-3.5" />
                          </div>
                          <span className="line-clamp-1 pt-0.5">{center.contact_info.address}</span>
                        </div>
                      )}
                      {center.contact_info?.phone && (
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <div className="bg-blue-50 p-1.5 rounded-lg shrink-0 text-blue-600">
                            <Phone className="h-3.5 w-3.5" />
                          </div>
                          <span className="pt-0.5">{center.contact_info.phone}</span>
                        </div>
                      )}
                      {center.contact_info?.website && (
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                          <div className="bg-blue-50 p-1.5 rounded-lg shrink-0 text-blue-600">
                            <Globe className="h-3.5 w-3.5" />
                          </div>
                          <span className="line-clamp-1 pt-0.5 text-blue-600 hover:underline">{center.contact_info.website}</span>
                        </div>
                      )}
                    </div>

                    <Button className="w-full rounded-xl bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 h-11 font-medium">
                      Prenota ora
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}


