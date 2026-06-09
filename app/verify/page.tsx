"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/components/api/connectors/authApi";

const VerifyEmailPage: React.FC = () => {
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  const hasVerified = useRef(false);

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setVerificationStatus("error");
      return;
    }

    if (hasVerified.current) {
      return;
    }

    const handleVerification = async () => {
      try {
        hasVerified.current = true;
        await dispatch(verifyEmail(token)).unwrap();
        setVerificationStatus("success");
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } catch (error) {
        setVerificationStatus("error");
      }
    };

    handleVerification();
  }, [searchParams, dispatch, router]);

  if (verificationStatus === "loading" || verificationStatus === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h1 className="text-lg font-semibold text-black">Redirecting...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mb-2">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Verification Failed
        </h1>
        <p className="text-gray-600 mb-4">
          {"The verification link is invalid or has expired."}
        </p>
        <div className="space-y-3">
          <Button onClick={() => router.push("/login")} className="w-full">
            Go to Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
