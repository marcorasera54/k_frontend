"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Building2,
  Phone,
  MapPin,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  getAllManagerRequests,
  updateManagerRequest,
  type ManagerRequest,
} from "@/components/api/connectors/managerRequestApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export default function AdminDashboard({ user }: { user: User }) {
  const dispatch = useAppDispatch();
  const [requests, setRequests] = useState<ManagerRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ManagerRequest | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewAction, setReviewAction] = useState<"approved" | "rejected">("approved");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    try {
      const filterValue = filter === "all" ? undefined : filter;
      const result = await dispatch(getAllManagerRequests(filterValue)).unwrap();
      setRequests(result);
    } catch (error) {
      toast.error("Errore nel caricamento delle richieste");
    }
  };

  const handleReview = (request: ManagerRequest, action: "approved" | "rejected") => {
    setSelectedRequest(request);
    setReviewAction(action);
    setShowReviewModal(true);
  };

  const submitReview = async () => {
    if (!selectedRequest) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        updateManagerRequest({
          requestId: selectedRequest._id,
          updateData: {
            status: reviewAction,
            rejection_reason: reviewAction === "rejected" ? rejectionReason : undefined,
          },
        })
      ).unwrap();

      toast.success(
        reviewAction === "approved"
          ? "Richiesta approvata con successo!"
          : "Richiesta rifiutata"
      );

      setShowReviewModal(false);
      setRejectionReason("");
      loadRequests();
    } catch (error: any) {
      toast.error("Errore nell'elaborazione della richiesta", {
        description: error || "Riprova più tardi",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            In Attesa
          </Badge>
        );
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Approvata
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Rifiutata
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/70 rounded-2xl p-6 border border-white/40 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard Amministratore
              </h1>
              <p className="text-gray-600 mt-1">
                Benvenuto, {user.first_name} {user.last_name}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              label: "Totale Richieste",
              value: stats.total,
              icon: FileText,
              color: "from-blue-500 to-cyan-500",
              bgColor: "bg-blue-50",
            },
            {
              label: "In Attesa",
              value: stats.pending,
              icon: Clock,
              color: "from-yellow-500 to-orange-500",
              bgColor: "bg-yellow-50",
            },
            {
              label: "Approvate",
              value: stats.approved,
              icon: CheckCircle2,
              color: "from-green-500 to-emerald-500",
              bgColor: "bg-green-50",
            },
            {
              label: "Rifiutate",
              value: stats.rejected,
              icon: XCircle,
              color: "from-red-500 to-pink-500",
              bgColor: "bg-red-50",
            },
          ].map((stat, index) => (
            <Card
              key={index}
              className="backdrop-blur-xl bg-white/80 border-white/40 hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center",
                      stat.bgColor
                    )}
                  >
                    <stat.icon className="w-6 h-6 text-gray-700" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 backdrop-blur-xl bg-white/70 rounded-xl p-2 border border-white/40 w-fit">
          {[
            { value: "all", label: "Tutte" },
            { value: "pending", label: "In Attesa" },
            { value: "approved", label: "Approvate" },
            { value: "rejected", label: "Rifiutate" },
          ].map((filterOption) => (
            <Button
              key={filterOption.value}
              variant={filter === filterOption.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(filterOption.value as any)}
              className={cn(
                "rounded-lg transition-all",
                filter === filterOption.value &&
                "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
              )}
            >
              {filterOption.label}
            </Button>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <Card className="backdrop-blur-xl bg-white/80 border-white/40">
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nessuna richiesta trovata</p>
              </CardContent>
            </Card>
          ) : (
            requests.map((request) => (
              <Card
                key={request._id}
                className="backdrop-blur-xl bg-white/80 border-white/40 hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-800">
                            {request.business_name}
                          </h3>
                          {getStatusBadge(request.status)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            <span>{request.business_address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span>{request.phone_number}</span>
                          </div>
                        </div>
                        <div className="mt-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Motivazione:
                          </p>
                          <p className="text-sm text-gray-600">{request.motivation}</p>
                        </div>
                        {request.rejection_reason && (
                          <div className="mt-3 p-3 rounded-lg bg-red-50 border border-red-100">
                            <p className="text-sm font-medium text-red-700 mb-1">
                              Motivo del rifiuto:
                            </p>
                            <p className="text-sm text-red-600">
                              {request.rejection_reason}
                            </p>
                          </div>
                        )}
                        <div className="mt-3 text-xs text-gray-500">
                          Richiesta il:{" "}
                          {new Date(request.created_at).toLocaleDateString("it-IT", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {request.status === "pending" && (
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <Button
                        onClick={() => handleReview(request, "approved")}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approva
                      </Button>
                      <Button
                        onClick={() => handleReview(request, "rejected")}
                        variant="outline"
                        className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Rifiuta
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Review Modal */}
      <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
        <DialogContent className="sm:max-w-[500px] backdrop-blur-xl bg-white/95 border-white/40">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  reviewAction === "approved"
                    ? "bg-gradient-to-br from-green-500 to-emerald-600"
                    : "bg-gradient-to-br from-red-500 to-pink-600"
                )}
              >
                {reviewAction === "approved" ? (
                  <CheckCircle2 className="w-6 h-6 text-white" />
                ) : (
                  <XCircle className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <DialogTitle className="text-2xl">
                  {reviewAction === "approved"
                    ? "Approva Richiesta"
                    : "Rifiuta Richiesta"}
                </DialogTitle>
                <DialogDescription>
                  {selectedRequest?.business_name}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            {reviewAction === "approved" ? (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                <p className="text-sm text-green-900">
                  L'utente verrà promosso a <strong>Field Manager</strong> e potrà
                  iniziare ad aggiungere i suoi centri sportivi sulla piattaforma.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-900">
                    Specifica il motivo del rifiuto. L'utente riceverà una notifica.
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo del rifiuto *
                  </label>
                  <Textarea
                    required
                    placeholder="Es. Informazioni incomplete, attività non verificabile..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    className="rounded-lg border-gray-200 focus:border-red-500 focus:ring-red-500/20 resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowReviewModal(false);
                setRejectionReason("");
              }}
              disabled={isSubmitting}
              className="rounded-lg"
            >
              Annulla
            </Button>
            <Button
              onClick={submitReview}
              disabled={
                isSubmitting ||
                (reviewAction === "rejected" && !rejectionReason.trim())
              }
              className={cn(
                "rounded-lg shadow-lg",
                reviewAction === "approved"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  : "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
              )}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Elaborazione...
                </>
              ) : reviewAction === "approved" ? (
                "Conferma Approvazione"
              ) : (
                "Conferma Rifiuto"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
