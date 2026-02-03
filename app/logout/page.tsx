"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { logoutUser } from "@/components/api/connectors/authApi";
import { clearAuth } from "@/store/slices/authSlice";

export default function LogoutPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const performLogout = async () => {
            // Dispatch the API logout
            await dispatch(logoutUser());

            // Clear redux state specifically (though thunk fulfillment does it too, extra safety)
            dispatch(clearAuth());

            // Redirect to home or login
            router.push("/");
        };

        performLogout();
    }, [dispatch, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 rounded-full border-2 border-slate-300 border-t-blue-600 animate-spin" />
                <p className="text-slate-500 font-medium">Disconnessione in corso...</p>
            </div>
        </div>
    );
}
