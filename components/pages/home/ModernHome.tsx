"use client";

import { useState } from "react";
import { Search, MapPin, Star, Clock, Euro, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SportType } from "@/lib/types/field";
import BecomeManagerModal from "@/components/modals/BecomeManagerModal";

interface ModernHomeProps {
    userRole?: "user" | "field_manager" | "administrator";
}

export default function ModernHome({ userRole = "user" }: ModernHomeProps) {
    const [selectedSport, setSelectedSport] = useState<SportType | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showBecomeManagerModal, setShowBecomeManagerModal] = useState(false);

    const sports = [
        {
            type: SportType.FOOTBALL,
            label: "Calcio",
            icon: "⚽",
            color: "from-green-400 to-emerald-500",
            bgColor: "bg-green-50",
        },
        {
            type: SportType.PADEL,
            label: "Padel",
            icon: "🎾",
            color: "from-blue-400 to-cyan-500",
            bgColor: "bg-blue-50",
        },
        {
            type: SportType.TENNIS,
            label: "Tennis",
            icon: "🎾",
            color: "from-yellow-400 to-orange-500",
            bgColor: "bg-yellow-50",
        },
        {
            type: SportType.BASKETBALL,
            label: "Basket",
            icon: "🏀",
            color: "from-orange-400 to-red-500",
            bgColor: "bg-orange-50",
        },
        {
            type: SportType.VOLLEYBALL,
            label: "Pallavolo",
            icon: "🏐",
            color: "from-purple-400 to-pink-500",
            bgColor: "bg-purple-50",
        },
    ];

    // Mock recommended fields
    const recommendedFields = [
        {
            id: "1",
            name: "Centro Sportivo Millennium",
            location: "Milano, Via Roma 123",
            sport: SportType.FOOTBALL,
            rating: 4.8,
            reviews: 124,
            price: 45,
            image: "https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800",
            availability: "Disponibile oggi",
            distance: "2.3 km",
        },
        {
            id: "2",
            name: "Padel Club Elite",
            location: "Milano, Corso Buenos Aires 45",
            sport: SportType.PADEL,
            rating: 4.9,
            reviews: 89,
            price: 35,
            image: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800",
            availability: "Disponibile oggi",
            distance: "1.8 km",
        },
        {
            id: "3",
            name: "Arena Basketball Pro",
            location: "Milano, Via Torino 67",
            sport: SportType.BASKETBALL,
            rating: 4.7,
            reviews: 156,
            price: 40,
            image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800",
            availability: "Disponibile domani",
            distance: "3.1 km",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Navbar with Glassmorphism */}
            <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg shadow-black/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-xl">K</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Kalcoliamo
                            </span>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden md:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    type="text"
                                    placeholder="Cerca campi sportivi..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-4 h-10 rounded-full border-gray-200 bg-white/50 backdrop-blur-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* User Actions */}
                        <div className="flex items-center gap-3">
                            {userRole === "user" && (
                                <Button
                                    variant="outline"
                                    onClick={() => setShowBecomeManagerModal(true)}
                                    className="rounded-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all"
                                >
                                    <TrendingUp className="w-4 h-4 mr-2" />
                                    Diventa Gestore
                                </Button>
                            )}
                            <Button className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30 transition-all">
                                Prenota Ora
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                        Trova il tuo campo perfetto
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Prenota campi sportivi in pochi click. Semplice, veloce e sicuro.
                    </p>
                </div>

                {/* Sport Selection with Animation */}
                <div className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Scegli il tuo sport
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-5xl mx-auto">
                        {sports.map((sport, index) => (
                            <div
                                key={sport.type}
                                className={cn(
                                    "group cursor-pointer transition-all duration-300 animate-in fade-in slide-in-from-bottom-4",
                                    `animation-delay-${index * 100}`
                                )}
                                style={{ animationDelay: `${index * 100}ms` }}
                                onClick={() => setSelectedSport(sport.type)}
                            >
                                <div
                                    className={cn(
                                        "relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl border-2 transition-all duration-300",
                                        selectedSport === sport.type
                                            ? "bg-white/90 border-blue-500 shadow-2xl shadow-blue-500/30 scale-105"
                                            : "bg-white/60 border-white/40 hover:bg-white/80 hover:border-gray-200 hover:scale-105 shadow-lg"
                                    )}
                                >
                                    {/* Gradient Background */}
                                    <div
                                        className={cn(
                                            "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br",
                                            sport.color
                                        )}
                                    />

                                    {/* Content */}
                                    <div className="relative flex flex-col items-center gap-3">
                                        <div
                                            className={cn(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center text-4xl transition-transform duration-300 group-hover:scale-110",
                                                sport.bgColor
                                            )}
                                        >
                                            {sport.icon}
                                        </div>
                                        <span className="font-semibold text-gray-800 text-center">
                                            {sport.label}
                                        </span>
                                    </div>

                                    {/* Selection Indicator */}
                                    {selectedSport === sport.type && (
                                        <div className="absolute top-2 right-2">
                                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center animate-in zoom-in">
                                                <svg
                                                    className="w-4 h-4 text-white"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={3}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommended Fields */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Campi consigliati per te
                        </h2>
                        <Button variant="ghost" className="text-blue-600 hover:text-blue-700">
                            Vedi tutti →
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedFields.map((field, index) => (
                            <div
                                key={field.id}
                                className="group animate-in fade-in slide-in-from-bottom-4"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <Card className="overflow-hidden backdrop-blur-xl bg-white/80 border-white/40 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-2">
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={field.image}
                                            alt={field.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                        {/* Badges */}
                                        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                                            <Badge className="bg-white/90 text-gray-800 backdrop-blur-sm border-0">
                                                {field.availability}
                                            </Badge>
                                            <Badge className="bg-blue-500/90 text-white backdrop-blur-sm border-0">
                                                {field.distance}
                                            </Badge>
                                        </div>
                                    </div>

                                    <CardContent className="p-5">
                                        {/* Title */}
                                        <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                            {field.name}
                                        </h3>

                                        {/* Location */}
                                        <div className="flex items-center gap-2 text-gray-600 mb-3">
                                            <MapPin className="w-4 h-4" />
                                            <span className="text-sm">{field.location}</span>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="flex items-center gap-1">
                                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-semibold text-gray-800">
                                                    {field.rating}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-500">
                                                ({field.reviews} recensioni)
                                            </span>
                                        </div>

                                        {/* Price & CTA */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                            <div className="flex items-center gap-1">
                                                <span className="text-2xl font-bold text-gray-800">
                                                    €{field.price}
                                                </span>
                                                <span className="text-sm text-gray-500">/ora</span>
                                            </div>
                                            <Button
                                                size="sm"
                                                className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30"
                                            >
                                                Prenota
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <BecomeManagerModal
                isOpen={showBecomeManagerModal}
                onClose={() => setShowBecomeManagerModal(false)}
            />
        </div>
    );
}
