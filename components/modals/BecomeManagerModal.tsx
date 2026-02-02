"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch } from "@/store/hooks";
import { createManagerRequest } from "@/components/api/connectors/managerRequestApi";

interface BecomeManagerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BecomeManagerModal({
    isOpen,
    onClose,
}: BecomeManagerModalProps) {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({
        businessName: "",
        businessAddress: "",
        phoneNumber: "",
        motivation: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await dispatch(
                createManagerRequest({
                    business_name: formData.businessName,
                    business_address: formData.businessAddress,
                    phone_number: formData.phoneNumber,
                    motivation: formData.motivation,
                })
            ).unwrap();

            toast.success("Richiesta inviata con successo!", {
                description: "Riceverai una notifica quando verrà esaminata.",
            });

            onClose();
            setFormData({
                businessName: "",
                businessAddress: "",
                phoneNumber: "",
                motivation: "",
            });
        } catch (error: any) {
            toast.error("Errore nell'invio della richiesta", {
                description: error || "Si è verificato un errore. Riprova.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] backdrop-blur-xl bg-white/95 border-white/40">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl">
                                Diventa Field Manager
                            </DialogTitle>
                            <DialogDescription>
                                Gestisci i tuoi centri sportivi e inizia a guadagnare
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Benefits */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                    {[
                        { icon: CheckCircle2, text: "Gestione completa" },
                        { icon: Clock, text: "Disponibilità 24/7" },
                        { icon: TrendingUp, text: "Aumenta i guadagni" },
                    ].map((benefit, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100"
                        >
                            <benefit.icon className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-medium text-blue-900">
                                {benefit.text}
                            </span>
                        </div>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome dell'attività *
                        </label>
                        <Input
                            required
                            placeholder="Es. Centro Sportivo Millennium"
                            value={formData.businessName}
                            onChange={(e) =>
                                setFormData({ ...formData, businessName: e.target.value })
                            }
                            className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Indirizzo *
                        </label>
                        <Input
                            required
                            placeholder="Via Roma 123, Milano"
                            value={formData.businessAddress}
                            onChange={(e) =>
                                setFormData({ ...formData, businessAddress: e.target.value })
                            }
                            className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Numero di telefono *
                        </label>
                        <Input
                            required
                            type="tel"
                            placeholder="+39 123 456 7890"
                            value={formData.phoneNumber}
                            onChange={(e) =>
                                setFormData({ ...formData, phoneNumber: e.target.value })
                            }
                            className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Motivazione *
                        </label>
                        <Textarea
                            required
                            placeholder="Raccontaci perché vuoi diventare un Field Manager..."
                            value={formData.motivation}
                            onChange={(e) =>
                                setFormData({ ...formData, motivation: e.target.value })
                            }
                            rows={4}
                            className="rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 resize-none"
                        />
                    </div>

                    {/* Info Alert */}
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
                        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-amber-900">
                            <p className="font-medium mb-1">Processo di approvazione</p>
                            <p className="text-amber-700">
                                La tua richiesta verrà esaminata dal nostro team entro 24-48
                                ore. Riceverai una notifica via email.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="rounded-lg"
                        >
                            Annulla
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/30"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Invio in corso...
                                </>
                            ) : (
                                "Invia Richiesta"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
