"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser } from "@/components/api/connectors/authApi";
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
      router.push("/dashboard");
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
        title: "Success!",
        message: result?.message || "Logged in successfully.",
      });
    } catch (error: any) {
      const errorMessage =
        typeof error === "string" ? error : error?.message || "Login failed.";

      setToast({
        type: TOAST_TYPE.ERROR,
        title: "Login Failed",
        message: errorMessage,
      });
    }
  };

  const handleGoogleLogin = async () => {
    try {
    } catch (error) {}
  };

  return (
    <div className="w-full mx-auto">
      <div className="px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Sign In to C
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            disabled={isLoading}
            className="rounded"
          />

          <Input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter your password"
            disabled={isLoading}
            className="rounded"
          />
          <div className="text-end">
            <a
              href="/forgot-password"
              className="text-sm text-gray-900 hover:text-black hover:underline font-medium"
            >
              Forgot your password?
            </a>
          </div>

          <Button
            type="submit"
            disabled={
              isLoading ||
              !/\S+@\S+\.\S+/.test(formData.email) ||
              !formData.password
            }
            className="w-full rounded"
          >
            {isLoading ? (
              <div className="py-0.5">
                <div className="w-4.5 h-4.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">or</span>
          </div>
        </div>
        <Button
          variant={"outline"}
          className="w-full rounded"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="py-0.5">
              <div className="w-4.5 h-4.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <span className="flex items-center gap-2">
              <GoogleIcon />
              Continue with Google
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
