"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearError } from "@/store/slices/authSlice";
import { ArrowLeft } from "lucide-react";
import { forgotPassword } from "@/components/api/connectors/authApi";

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);

    if (errors.email) {
      setErrors((prev) => ({
        ...prev,
        email: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(forgotPassword({ email })).unwrap();
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Forgot password failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full text-center">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Email per reimpostare la password inviata!
          </h1>
          <p className="text-gray-600 text-base mb-2">
            Controlla la tua casella di posta o spam per ulteriori
            istruzioni.{" "}
          </p>
        </div>
        <Button
          onClick={() => router.push("/login")}
          className="w-full h-10 rounded bg-black hover:bg-gray-900 text-white font-medium transition-colors"
        >
          Torna al login
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          {" "}
          Password Dimenticata?
        </h1>
        <p className="text-gray-600 text-base">
          Nessun problema, ti invieremo le istruzioni per il ripristino.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="email"
          name="email"
          value={email}
          onChange={handleInputChange}
          placeholder="you@example.com"
          disabled={isLoading}
          className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
        />

        <Button
          type="submit"
          disabled={isLoading || !/\S+@\S+\.\S+/.test(email)}
          className="w-full h-10 rounded bg-black hover:bg-gray-900 text-white font-medium transition-colors"
        >
          {isLoading ? (
            <div className="py-0.5">
              <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            "Invia"
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <a
          href="/login"
          className="inline-flex items-center gap-2 text-md font-medium text-black/80 hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Ritorna al login</span>
        </a>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
