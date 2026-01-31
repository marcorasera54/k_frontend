"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/store/hooks";
import { clearError } from "@/store/slices/authSlice";
import { ArrowLeft } from "lucide-react";
import { resetPassword, verifyResetToken } from "@/components/api/connectors/authApi";

const ResetPasswordForm: React.FC = () => {
  const [formData, setFormData] = useState({
    new_password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null);
  const [isResetSuccessful, setIsResetSuccessful] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    dispatch(clearError());

    if (token) {
      dispatch(verifyResetToken(token))
        .unwrap()
        .then(
          (response: {
            valid:
              | boolean
              | ((prevState: boolean | null) => boolean | null)
              | null;
          }) => {
            setIsTokenValid(response.valid);
          },
        )
        .catch(() => {
          setIsTokenValid(false);
        });
    } else {
      setIsTokenValid(false);
    }
  }, [dispatch, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.new_password) {
      newErrors.new_password = "Password is required";
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = "Password must be at least 8 characters";
    }

    if (!formData.confirm_password) {
      newErrors.confirm_password = "Please confirm your password";
    } else if (formData.new_password !== formData.confirm_password) {
      newErrors.confirm_password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !token) {
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(
        resetPassword({
          token,
          new_password: formData.new_password,
          confirm_password: formData.confirm_password,
        }),
      ).unwrap();

      setIsResetSuccessful(true);
    } catch (error: any) {
      console.error("Password reset failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTokenValid === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h1 className="text-lg font-semibold text-black">Redirecting...</h1>
        </div>
      </div>
    );
  }

  if (isTokenValid === false) {
    return (
      <div className="w-full text-center">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Token non valido o scaduto
          </h1>
          <p className="text-gray-600 text-base mb-2">
            Richiedi un nuovo link per reimpostare la password.
          </p>
        </div>

        <Button
          onClick={() => router.push("/forgot-password")}
          className="w-full h-10 rounded bg-black hover:bg-gray-900 text-white font-medium transition-colors"
        >
          Richiedi nuovo reset
        </Button>
      </div>
    );
  }

  if (isResetSuccessful) {
    return (
      <div className="w-full text-center">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Password reimpostata con successo!
          </h1>
          <p className="text-gray-600 text-base mb-2">
            Ora puoi accedere utilizzando la tua nuova password.
          </p>
        </div>
        <Button
          onClick={() => router.push("/login")}
          className="w-full h-10 rounded bg-black hover:bg-gray-900 text-white font-medium transition-colors"
        >
          Vai al login
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Reimposta la password
        </h1>
        <p className="text-gray-600 text-base">
          Inserisci la nuova password e confermala per continuare.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <Input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleInputChange}
            placeholder="••••••••"
            disabled={isLoading}
            className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
          />
        </div>
        <div>
          <label
            htmlFor="confirm_password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Conferma Password
          </label>
          <Input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleInputChange}
            placeholder="••••••••"
            disabled={isLoading}
            className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
          />
        </div>

        <Button
          type="submit"
          disabled={
            isLoading || !formData.new_password || !formData.confirm_password
          }
          className="w-full h-10 rounded bg-black hover:bg-gray-900 text-white font-medium transition-colors"
        >
          {isLoading ? (
            <div className="py-0.5">
              <div className="w-4.5 h-4.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            "Reimposta"
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

export default ResetPasswordForm;
