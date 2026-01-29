"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearError } from "@/store/slices/authSlice";

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
      // await dispatch(forgotPassword({ email })).unwrap();
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Forgot password failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="px-8">
          <div className="text-center mb-8">
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
              Password reset email sent!
              <br /> Check your inbox for further instructions.
            </div>
            <Button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full mt-4"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className="px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Forgot Password
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            name="email"
            value={email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            disabled={isLoading}
          />

          <Button
            type="submit"
            disabled={isLoading || !/\S+@\S+\.\S+/.test(email)}
            className="w-full"
          >
            {isLoading ? (
              <div className="py-0.5">
                <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-md text-black/80 hover:text-black font-medium"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
