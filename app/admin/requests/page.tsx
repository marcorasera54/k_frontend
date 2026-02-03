"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAllManagerRequests, updateManagerRequest, ManagerRequest } from "@/components/api/connectors/managerRequestApi";
import { UserRole } from "@/lib/types/auth";
import {
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Building2,
    MapPin,
    Phone,
    FileText,
    ChevronLeft,
    Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { setToast, TOAST_TYPE } from "@/components/ui/toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export default function AdminRequestsPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state) => state.auth);

    const [requests, setRequests] = useState<ManagerRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "approved" | "rejected">("pending");
    const [searchQuery, setSearchQuery] = useState("");

    const [selectedRequest, setSelectedRequest] = useState<ManagerRequest | null>(null);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        // Redirect if not admin
        if (user && user.role !== UserRole.ADMIN) {
            router.push("/");
            return;
        }

        loadRequests();
    }, [dispatch, user, router]);

    const loadRequests = async () => {
        setIsLoading(true);
        try {
            const action = await dispatch(getAllManagerRequests(undefined));
            if (getAllManagerRequests.fulfilled.match(action)) {
                setRequests(action.payload);
            }
        } catch (error) {
            console.error("Failed to load requests", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async (request: ManagerRequest) => {
        setActionLoading(true);
        try {
            await dispatch(updateManagerRequest({
                requestId: request._id,
                updateData: { status: "approved" }
            })).unwrap();

            setToast({
                type: TOAST_TYPE.SUCCESS,
                title: "Richiesta Approvata",
                message: `La richiesta di ${request.business_name} è stata approvata. L'utente è ora un Field Manager.`
            });
            loadRequests(); // Reload list
        } catch (error: any) {
            setToast({
                type: TOAST_TYPE.ERROR,
                title: "Errore",
                message: typeof error === 'string' ? error : "Errore durante l'approvazione."
            });
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedRequest || !rejectionReason.trim()) return;

        setActionLoading(true);
        try {
            await dispatch(updateManagerRequest({
                requestId: selectedRequest._id,
                updateData: {
                    status: "rejected",
                    rejection_reason: rejectionReason
                }
            })).unwrap();

            setToast({
                type: TOAST_TYPE.SUCCESS,
                title: "Richiesta Rifiutata",
                message: `La richiesta di ${selectedRequest.business_name} è stata rifiutata.`
            });
            setShowRejectDialog(false);
            setRejectionReason("");
            loadRequests(); // Reload list
        } catch (error: any) {
            setToast({
                type: TOAST_TYPE.ERROR,
                title: "Errore",
                message: typeof error === 'string' ? error : "Errore durante il rifiuto."
            });
        } finally {
            setActionLoading(false);
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesStatus = filterStatus === "all" || req.status === filterStatus;
        const matchesSearch =
            req.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            req.business_address.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-yellow-200"><Clock className="w-3 h-3 mr-1" /> In Attesa</Badge>;
            case "approved":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200"><CheckCircle className="w-3 h-3 mr-1" /> Approvata</Badge>;
            case "rejected":
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Rifiutata</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    if (!user || user.role !== UserRole.ADMIN) {
        return null; // Or loading spinner while redirecting
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.push("/")} className="rounded-full">
                            <ChevronLeft className="h-5 w-5 text-slate-500" />
                        </Button>
                        <h1 className="text-2xl font-bold text-slate-900">Gestione Richieste Manager</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative hidden md:block w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Cerca richieste..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 bg-slate-50 border-slate-200 focus:bg-white rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <Tabs defaultValue="pending" className="w-full mb-8" onValueChange={(val) => setFilterStatus(val as any)}>
                    <TabsList className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                        <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">In Attesa</TabsTrigger>
                        <TabsTrigger value="approved" className="rounded-lg data-[state=active]:bg-green-50 data-[state=active]:text-green-700">Approvate</TabsTrigger>
                        <TabsTrigger value="rejected" className="rounded-lg data-[state=active]:bg-red-50 data-[state=active]:text-red-700">Rifiutate</TabsTrigger>
                        <TabsTrigger value="all" className="rounded-lg">Tutte</TabsTrigger>
                    </TabsList>
                </Tabs>

                {isLoading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map(i => (
                            <Card key={i} className="rounded-3xl border-slate-200 shadow-sm overflow-hidden">
                                <CardHeader className="pb-3 space-y-2">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Skeleton className="h-20 w-full rounded-xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                </CardContent>
                                <CardFooter className="pt-0">
                                    <Skeleton className="h-10 w-full rounded-xl" />
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : filteredRequests.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                        <FileText className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">Nessuna richiesta trovata</h3>
                        <p className="text-slate-500 text-sm">Non ci sono richieste che corrispondono ai filtri selezionati.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {filteredRequests.map(req => (
                            <Card key={req._id} className="rounded-3xl border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                            <Building2 className="h-6 w-6" />
                                        </div>
                                        {getStatusBadge(req.status)}
                                    </div>
                                    <CardTitle className="text-xl">{req.business_name}</CardTitle>
                                    <CardDescription className="flex items-center gap-1 mt-1">
                                        <MapPin className="h-3.5 w-3.5" /> {req.business_address}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-4 text-sm text-slate-600">
                                    <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
                                        <div className="flex items-start gap-2">
                                            <FileText className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                                            <p className="italic">"{req.motivation}"</p>
                                        </div>
                                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                                            <Phone className="h-4 w-4 text-slate-400" />
                                            <span className="font-medium text-slate-700">{req.phone_number}</span>
                                        </div>
                                    </div>

                                    {req.status === "rejected" && req.rejection_reason && (
                                        <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs border border-red-100 flex gap-2">
                                            <AlertCircle className="h-4 w-4 shrink-0" />
                                            <div>
                                                <span className="font-bold block mb-1">Motivo Rifiuto:</span>
                                                {req.rejection_reason}
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-xs text-slate-400 pt-2">
                                        Richiesta inviata il {new Date(req.created_at).toLocaleDateString('it-IT')}
                                    </div>
                                </CardContent>
                                {req.status === "pending" && (
                                    <CardFooter className="pt-2 gap-3 border-t border-slate-100 p-6 bg-slate-50/50">
                                        <Button
                                            variant="outline"
                                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl"
                                            onClick={() => {
                                                setSelectedRequest(req);
                                                setShowRejectDialog(true);
                                            }}
                                            disabled={actionLoading}
                                        >
                                            Rifiuta
                                        </Button>
                                        <Button
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200"
                                            onClick={() => handleApprove(req)}
                                            disabled={actionLoading}
                                        >
                                            Approva
                                        </Button>
                                    </CardFooter>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </main>

            {/* Reject Dialog */}
            <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogContent className="sm:max-w-md rounded-3xl p-0 overflow-hidden bg-white">
                    <div className="bg-red-50 p-6 border-b border-red-100">
                        <DialogHeader>
                            <DialogTitle className="text-red-700 flex items-center gap-2">
                                <XCircle className="h-5 w-5" /> Rifiuta Richiesta
                            </DialogTitle>
                            <DialogDescription className="text-red-600/80">
                                Stai per rifiutare la richiesta di <strong>{selectedRequest?.business_name}</strong>.
                                Inserisci una motivazione per informare l'utente.
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <div className="p-6">
                        <Textarea
                            placeholder="Inserisci il motivo del rifiuto..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="min-h-[120px] rounded-xl border-slate-200 focus:border-red-300 focus:ring-red-100 placeholder:text-slate-400 resize-none"
                        />
                    </div>
                    <div className="p-6 pt-0 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setShowRejectDialog(false)} className="rounded-xl">Annulla</Button>
                        <Button
                            variant="destructive"
                            className="rounded-xl bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200"
                            onClick={handleReject}
                            disabled={!rejectionReason.trim() || actionLoading}
                        >
                            {actionLoading ? "Elaborazione..." : "Conferma Rifiuto"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
