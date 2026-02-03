"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchSportsCenterById } from "@/components/api/connectors/sportsCenterApi";
import { fetchFields } from "@/components/api/connectors/fieldApi";
import { fetchAllBookings, createBooking } from "@/components/api/connectors/bookingApi";
import {
    MapPin,
    Phone,
    Globe,
    Mail,
    Calendar as CalendarIcon,
    Clock,
    Check,
    ChevronLeft,
    Info,
    DollarSign,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SportType } from "@/lib/types/field";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Booking, BookingStatus } from "@/lib/types/booking";
import { setToast, TOAST_TYPE } from "@/components/ui/toast";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function SportsCenterDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const centerId = params.id as string;

    const { selectedSportsCenter, isLoading: centerLoading } = useAppSelector(
        (state) => state.sportsCenters
    );
    // fields state is not in a separate slice usually, referencing local or need to check where fetchFields goes.
    // Wait, fetchFields updates nothing in the store? 
    // Checking fieldApi.tsx, it's a createAsyncThunk but where is the slice? I need to check fieldSlice.ts.
    // If not, I'll use local state for fields.

    // Actually, let's assume I need to fetch fields locally if I can't rely on global store or if I want to avoid pollution.
    // But wait, useAppSelector(state => state.fields) might exist.
    // Let's assume for now I will rely on the thunk return, but best practice is store.
    // Let me check 'store/store.ts' later or just use local state for simplicity and robustness here.

    const [fields, setFields] = useState<any[]>([]);
    const [fieldsLoading, setFieldsLoading] = useState(true);

    const [selectedField, setSelectedField] = useState<any | null>(null);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);

    useEffect(() => {
        if (centerId) {
            dispatch(fetchSportsCenterById(centerId));

            const loadFields = async () => {
                try {
                    // We need to cast the thunk result or use unwrap.
                    const action = await dispatch(fetchFields({ sports_center_id: centerId }));
                    if (fetchFields.fulfilled.match(action)) {
                        setFields(action.payload);
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    setFieldsLoading(false);
                }
            };
            loadFields();
        }
    }, [centerId, dispatch]);

    useEffect(() => {
        if (selectedField) {
            const loadBookings = async () => {
                const action = await dispatch(fetchAllBookings({ field_id: selectedField._id }));
                if (fetchAllBookings.fulfilled.match(action)) {
                    setBookings(action.payload);
                }
            };
            loadBookings();
        }
    }, [selectedField, dispatch]);


    const handleFieldClick = (field: any) => {
        setSelectedField(field);
        setShowBookingModal(true);
        setSelectedTimeSlot(null);
    };

    const timeSlots = useMemo(() => {
        const slots = [];
        for (let i = 8; i < 23; i++) {
            const hour = i.toString().padStart(2, '0');
            slots.push(`${hour}:00`);
        }
        return slots;
    }, []);

    const getSlotStatus = (time: string, date: string) => {
        if (!selectedField) return 'free';

        // Simple collision detection
        // Booking starts at booking.start_time
        // Checks if the slot start time is within any booking

        const slotStart = new Date(`${date}T${time}:00`);
        const slotEnd = new Date(slotStart.getTime() + 60 * 60 * 1000); // Assume 1 hour slots for now

        const isOccupied = bookings.some(b => {
            if (b.status === BookingStatus.CANCELLED) return false;
            const start = new Date(b.start_time);
            const end = new Date(b.end_time);

            // Check overlap
            return (slotStart < end && slotEnd > start);
        });

        return isOccupied ? 'occupied' : 'free';
    };

    const handleBooking = async () => {
        if (!selectedField || !selectedTimeSlot) return;

        setBookingLoading(true);
        try {
            const start = new Date(`${selectedDate}T${selectedTimeSlot}:00`);
            const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour duration fixed for now

            await dispatch(createBooking({
                field_id: selectedField._id,
                start_time: start.toISOString(),
                end_time: end.toISOString()
            })).unwrap();

            setToast({
                type: TOAST_TYPE.SUCCESS,
                title: "Prenotazione confermata",
                message: "La tua prenotazione è stata effettuata con successo."
            });
            setShowBookingModal(false);

            // Refresh bookings
            const action = await dispatch(fetchAllBookings({ field_id: selectedField._id }));
            if (fetchAllBookings.fulfilled.match(action)) {
                setBookings(action.payload);
            }

        } catch (error: any) {
            setToast({
                type: TOAST_TYPE.ERROR,
                title: "Errore",
                message: typeof error === 'string' ? error : "Impossibile effettuare la prenotazione."
            });
        } finally {
            setBookingLoading(false);
        }
    };

    if (centerLoading || !selectedSportsCenter) {
        return (
            <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
                <div className="space-y-4 w-full max-w-3xl">
                    <Skeleton className="h-64 w-full rounded-3xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-1/3" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="relative h-[400px] w-full bg-slate-900 overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&q=80"
                    alt={selectedSportsCenter.name}
                    fill
                    className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />

                <div className="absolute top-6 left-6 z-10">
                    <Button variant="ghost" className="text-white hover:bg-white/20 rounded-full" onClick={() => router.back()}>
                        <ChevronLeft className="mr-1 h-5 w-5" /> Torna indietro
                    </Button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end gap-6">
                        <div className="h-24 w-24 md:h-32 md:w-32 rounded-2xl border-4 border-white bg-white shadow-xl overflow-hidden shrink-0">
                            {selectedSportsCenter.logo_url ? (
                                <Image src={selectedSportsCenter.logo_url} alt="Logo" width={128} height={128} className="object-cover h-full w-full" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-slate-100">
                                    <MapPin className="h-10 w-10 text-slate-400" />
                                </div>
                            )}
                        </div>
                        <div className="text-white pb-2">
                            <h1 className="text-3xl md:text-5xl font-bold mb-2">{selectedSportsCenter.name}</h1>
                            <div className="flex flex-wrap gap-4 text-slate-300 text-sm md:text-base font-medium">
                                {selectedSportsCenter.contact_info?.address && (
                                    <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {selectedSportsCenter.contact_info.address}</span>
                                )}
                                {selectedSportsCenter.contact_info?.phone && (
                                    <span className="flex items-center gap-1"><Phone className="h-4 w-4" /> {selectedSportsCenter.contact_info.phone}</span>
                                )}
                                {selectedSportsCenter.contact_info?.website && (
                                    <span className="flex items-center gap-1"><Globe className="h-4 w-4" /> {selectedSportsCenter.contact_info.website}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-8 relative z-10">

                {/* About Section */}
                {selectedSportsCenter.description && (
                    <Card className="rounded-3xl border-slate-200 shadow-sm mb-10">
                        <CardContent className="p-8">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Info className="h-5 w-5 text-blue-600" /> Informazioni
                            </h2>
                            <p className="text-slate-600 leading-relaxed">{selectedSportsCenter.description}</p>
                        </CardContent>
                    </Card>
                )}

                {/* Fields List */}
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Campi Disponibili</h2>

                {fieldsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 rounded-3xl" />)}
                    </div>
                ) : fields.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {fields.map(field => (
                            <Card key={field._id} className="rounded-3xl border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer group overflow-hidden" onClick={() => handleFieldClick(field)}>
                                <div className="h-48 bg-slate-100 relative">
                                    {/* Placeholder pattern or image based on sport */}
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                        {field.sport_type === SportType.FOOTBALL && <span className="text-4xl text-slate-200 font-black">CALCIO</span>}
                                        {field.sport_type === SportType.PADEL && <span className="text-4xl text-slate-200 font-black">PADEL</span>}
                                        {!field.sport_type && <span className="text-4xl text-slate-200 font-black">CAMPO</span>}
                                    </div>
                                    <Badge className="absolute top-4 right-4 bg-white/90 text-slate-900 hover:bg-white backdrop-blur-sm shadow-sm">{field.sport_type}</Badge>
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{field.name}</h3>
                                            <p className="text-sm text-slate-500">{field.description || "Nessuna descrizione"}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="block text-2xl font-bold text-blue-600">€{field.hourly_rate}</span>
                                            <span className="text-xs text-slate-400 font-medium">/ora</span>
                                        </div>
                                    </div>

                                    <div className="py-2 flex gap-2 flex-wrap">
                                        {field.is_indoor && <Badge variant="secondary" className="bg-slate-100 text-slate-600">Indoor</Badge>}
                                        {field.has_lighting && <Badge variant="secondary" className="bg-slate-100 text-slate-600">Luci</Badge>}
                                        {field.surface_type && <Badge variant="secondary" className="bg-slate-100 text-slate-600">{field.surface_type}</Badge>}
                                    </div>

                                    <Button className="w-full mt-4 rounded-xl" variant="default">Prenota Ora</Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
                        <AlertCircle className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">Nessun campo disponibile in questo centro.</p>
                    </div>
                )}
            </main>

            {/* Booking Modal */}
            <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
                <DialogContent className="max-w-md rounded-3xl p-0 overflow-hidden bg-white">
                    {selectedField && (
                        <>
                            <div className="bg-slate-50 p-6 border-b border-slate-100">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-bold">Prenota {selectedField.name}</DialogTitle>
                                    <DialogDescription>
                                        Seleziona data e orario per la tua partita.
                                    </DialogDescription>
                                </DialogHeader>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Date Selection */}
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <CalendarIcon className="h-4 w-4" /> Data
                                    </label>
                                    <Input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="rounded-xl h-11 border-slate-200 bg-slate-50 focus:bg-white transition-all"
                                    />
                                </div>

                                {/* Time Slots */}
                                <div className="space-y-3">
                                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                                        <Clock className="h-4 w-4" /> Orari Disponibili
                                    </label>
                                    <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                                        {timeSlots.map(time => {
                                            const status = getSlotStatus(time, selectedDate);
                                            const isSelected = selectedTimeSlot === time;

                                            return (
                                                <button
                                                    key={time}
                                                    disabled={status === 'occupied'}
                                                    onClick={() => setSelectedTimeSlot(time)}
                                                    className={cn(
                                                        "py-2 px-1 rounded-lg text-sm font-medium transition-all text-center border",
                                                        status === 'occupied' && "bg-slate-100 text-slate-400 border-transparent cursor-not-allowed decoration-slate-400 line-through decoration-2",
                                                        status === 'free' && !isSelected && "bg-white border-slate-200 text-slate-700 hover:border-blue-500 hover:text-blue-600 hover:shadow-sm",
                                                        isSelected && "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                                                    )}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Summary */}
                                {selectedTimeSlot && (
                                    <div className="bg-blue-50 rounded-xl p-4 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Totale</p>
                                            <p className="text-sm text-blue-800 font-medium">1 Ora x €{selectedField.hourly_rate}</p>
                                        </div>
                                        <div className="text-2xl font-bold text-blue-700">
                                            €{selectedField.hourly_rate}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-3xl">
                                <Button variant="ghost" onClick={() => setShowBookingModal(false)} className="rounded-xl hover:bg-slate-200/50">Annulla</Button>
                                <Button
                                    onClick={handleBooking}
                                    disabled={!selectedTimeSlot || bookingLoading}
                                    className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200"
                                >
                                    {bookingLoading ? "Elaborazione..." : "Conferma Prenotazione"}
                                </Button>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
