"use client";

import { useState } from "react";
import ModernHome from "@/components/pages/home/ModernHome";
import BecomeManagerModal from "@/components/modals/BecomeManagerModal";
import AddSportsCenterModal from "@/components/modals/AddSportsCenterModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ModernDemoPage() {
    const [userRole, setUserRole] = useState<"user" | "field_manager" | "administrator">("user");
    const [showBecomeManagerModal, setShowBecomeManagerModal] = useState(false);
    const [showAddCenterModal, setShowAddCenterModal] = useState(false);

    return (
        <div className="relative">
            {/* Demo Controls - Fixed at bottom */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 backdrop-blur-xl bg-white/90 border border-white/40 rounded-2xl shadow-2xl shadow-black/10 p-4">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-gray-700">Demo Controls:</span>

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant={userRole === "user" ? "default" : "outline"}
                            onClick={() => setUserRole("user")}
                            className="rounded-lg"
                        >
                            User
                        </Button>
                        <Button
                            size="sm"
                            variant={userRole === "field_manager" ? "default" : "outline"}
                            onClick={() => setUserRole("field_manager")}
                            className="rounded-lg"
                        >
                            Field Manager
                        </Button>
                        <Button
                            size="sm"
                            variant={userRole === "administrator" ? "default" : "outline"}
                            onClick={() => setUserRole("administrator")}
                            className="rounded-lg"
                        >
                            Admin
                        </Button>
                    </div>

                    <div className="h-6 w-px bg-gray-300" />

                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowBecomeManagerModal(true)}
                            className="rounded-lg border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                            Test: Diventa Manager
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setShowAddCenterModal(true)}
                            className="rounded-lg border-purple-200 text-purple-600 hover:bg-purple-50"
                        >
                            Test: Aggiungi Centro
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <ModernHome userRole={userRole} />

            {/* Modals */}
            <BecomeManagerModal
                isOpen={showBecomeManagerModal}
                onClose={() => setShowBecomeManagerModal(false)}
            />
            <AddSportsCenterModal
                isOpen={showAddCenterModal}
                onClose={() => setShowAddCenterModal(false)}
            />
        </div>
    );
}
