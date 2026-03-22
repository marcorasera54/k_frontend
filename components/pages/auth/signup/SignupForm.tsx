"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearError } from "@/store/slices/authSlice";
import { setToast, TOAST_TYPE } from "@/components/ui/toast";
import {
  initiateGoogleLogin,
  signupUser,
} from "@/components/api/connectors/authApi";
import { GoogleIcon } from "@/lib/constants/icons/google-icon";

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

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

    if (!formData.first_name.trim()) {
      newErrors.first_name = "Il nome è obbligatorio";
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = "Il cognome è obbligatorio";
    }

    if (!formData.email) {
      newErrors.email = "L'email è obbligatoria";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Inserisci un indirizzo email valido";
    }

    if (!formData.password) {
      newErrors.password = "La password è obbligatoria";
    } else if (formData.password.length < 8) {
      newErrors.password = "La password deve contenere almeno 8 caratteri";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Conferma la password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Le password non coincidono";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const { confirmPassword, ...signupData } = formData;
      await dispatch(signupUser(signupData)).unwrap();

      setIsSuccess(true);

      setToast({
        type: TOAST_TYPE.SUCCESS,
        title: "Successo",
        message: "Il tuo account è stato creato con successo!",
      });
    } catch (error: any) {
      const errorMessage =
        error?.message || "Qualcosa non va. Per favore, riprova.";

      setToast({
        type: TOAST_TYPE.ERROR,
        title: "Registrazione fallita",
        message: errorMessage,
      });
    }
  };

  const handleGoogleLogin = () => {
    dispatch(initiateGoogleLogin());
  };

  if (isSuccess) {
    return (
      <div className="w-full text-center">
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Account Creato!
          </h1>
          <p className="text-gray-600 text-base mb-2">
            Abbiamo inviato un'email di verifica a
          </p>
          <p className="text-gray-900 font-semibold mb-6">{formData.email}</p>
          <p className="text-gray-600 text-sm mb-8">
            Si prega di controllare la posta in arrivo e cliccare sul link di
            verifica per attivare il tuo account.
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
          Crea un account!
        </h1>
        <p className="text-gray-600 text-base">
          Inizia con il tuo account gratuito
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="first_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nome
            </label>
            <Input
              id="first_name"
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="John"
              disabled={isLoading}
              className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
            />
            {errors.first_name && (
              <p className="mt-1.5 text-sm text-red-600">{errors.first_name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="last_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cognome
            </label>
            <Input
              id="last_name"
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="Doe"
              disabled={isLoading}
              className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
            />
            {errors.last_name && (
              <p className="mt-1.5 text-sm text-red-600">{errors.last_name}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="you@example.com"
            disabled={isLoading}
            className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
          />
          {errors.email && (
            <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="••••••••"
            disabled={isLoading}
            className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
          />
          {errors.password && (
            <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
          )}
          {!errors.password && formData.password && (
            <p className="mt-1.5 text-sm text-gray-500">
              Must be at least 8 characters
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Conferma password
          </label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="••••••••"
            disabled={isLoading}
            className="rounded h-10 px-4 border-gray-300 focus:border-gray-900 focus:ring-gray-900 bg-white"
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-sm text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={
            isLoading ||
            !formData.first_name ||
            !formData.last_name ||
            !/\S+@\S+\.\S+/.test(formData.email) ||
            !formData.password ||
            !formData.confirmPassword
          }
          className="w-full h-10 rounded bg-black hover:bg-gray-900 text-white font-medium transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            "Registrati"
          )}
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 sm:bg-white bg-gray-50 text-gray-500 font-medium">
            O
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full h-10 rounded border border-gray-300 hover:border-gray-400/50 hover:bg-gray-50 font-medium transition-colors"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <span className="flex items-center gap-3">
            <GoogleIcon />
            Continua con Google
          </span>
        )}
      </Button>

      <p className="mt-8 text-center text-sm text-gray-600">
        Hai già un account?{" "}
        <a href="/login" className="font-medium text-gray-900 hover:underline">
          Accedi
        </a>
      </p>
    </div>
  );
};

export default SignupForm;
