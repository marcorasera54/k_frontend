"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearError } from "@/store/slices/authSlice";

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

    // Verify token on component mount
    //if (token) {
    //  dispatch(verifyResetToken(token))
    //    .unwrap()
    //    .then(
    //      (response: {
    //        valid:
    //          | boolean
    //          | ((prevState: boolean | null) => boolean | null)
    //          | null;
    //      }) => {
    //        setIsTokenValid(response.valid);
    //      },
    //    )
    //    .catch(() => {
    //      setIsTokenValid(false);
    //    });
    //} else {
    //  setIsTokenValid(false);
    //}
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
      // await dispatch(
      //   resetPassword({
      //     token,
      //     new_password: formData.new_password,
      //     confirm_password: formData.confirm_password,
      //   }),
      // ).unwrap();

      setIsResetSuccessful(true);
    } catch (error: any) {
      console.error("Password reset failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isTokenValid === null) {
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
      <div className="w-full mx-auto">
        <div className="px-8">
          <div className="text-center mb-8">
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              Invalid or expired reset token.
              <br /> Please request a new password reset.
            </div>
            <Button
              type="button"
              onClick={() => router.push("/forgot-password")}
              className="w-full mt-4"
            >
              Request New Reset
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isResetSuccessful) {
    return (
      <div className="w-full mx-auto">
        <div className="text-center px-8">
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            Password reset successful!
            <br /> You can now login with your new password.
          </div>
          <Button
            onClick={() => router.push("/login")}
            className="w-full"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className="px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Reset Password
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            name="new_password"
            value={formData.new_password}
            onChange={handleInputChange}
            placeholder="Enter new password"
            disabled={isLoading}
          />

          <Input
            type="password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleInputChange}
            placeholder="Confirm new password"
            disabled={isLoading}
          />

          <Button
            type="submit"
            disabled={
              isLoading || !formData.new_password || !formData.confirm_password
            }
            className="w-full"
          >
            {isLoading ? (
              <div className="py-0.5">
                <div className="w-4.5 h-4.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              "Reset Password"
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

export default ResetPasswordForm;
