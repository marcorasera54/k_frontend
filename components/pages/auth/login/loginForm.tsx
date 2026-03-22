"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  initiateGoogleLogin,
  loginUser,
} from "@/components/api/connectors/authApi";
import { GoogleIcon } from "@/lib/constants/icons/google-icon";
import { setToast, TOAST_TYPE } from "@/components/ui/toast";

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/fields");
    }
  }, [isAuthenticated, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await dispatch(loginUser(formData)).unwrap();

      setToast({
        type: TOAST_TYPE.SUCCESS,
        title: "Successo!",
        message: result?.message || "Accesso eseguito con successo.",
      });
    } catch (error: any) {
      const errorMessage =
        typeof error === "string" ? error : error?.message || "Login fallito.";

      setToast({
        type: TOAST_TYPE.ERROR,
        title: "Accesso fallito",
        message: errorMessage,
      });
    }
  };

  const handleGoogleLogin = () => {
    dispatch(initiateGoogleLogin());
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Bentornato!
        </h1>
        <p className="text-gray-600 text-base">
          Accedi al tuo account per continuare
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
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
        </div>

        <div className="flex items-center justify-end">
          <a
            href="/forgot-password"
            className="text-sm text-gray-900 hover:text-black hover:underline font-medium"
          >
            Password dimenticata?
          </a>
        </div>

        <Button
          type="submit"
          disabled={
            isLoading ||
            !/\S+@\S+\.\S+/.test(formData.email) ||
            !formData.password
          }
          className="w-full h-10 rounded bg-black hover:bg-gray-900 text-white font-medium transition-colors"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            "Accedi"
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
        Non hai ancora un account?{" "}
        <a href="/signup" className="font-medium text-gray-900 hover:underline">
          Registrati
        </a>
      </p>
    </div>
  );
};

export default LoginForm;
