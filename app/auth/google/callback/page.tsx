"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { googleCallback } from "@/components/api/connectors/authApi";
import { setToast, TOAST_TYPE } from "@/components/ui/toast";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error || !code) {
      setToast({
        type: TOAST_TYPE.ERROR,
        title: "Accesso fallito",
        message: "Google authentication was cancelled or failed.",
      });
      router.push("/login");
      return;
    }

    dispatch(googleCallback(code))
      .unwrap()
      .then(() => {
        setToast({
          type: TOAST_TYPE.SUCCESS,
          title: "Successo!",
          message: "Accesso con Google eseguito con successo.",
        });
        router.push("/");
      })
      .catch(() => {
        setToast({
          type: TOAST_TYPE.ERROR,
          title: "Accesso fallito",
          message: "Google authentication failed. Please try again.",
        });
        router.push("/login");
      });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Accesso in corso...</p>
      </div>
    </div>
  );
}
