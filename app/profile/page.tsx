"use client";

import { useEffect } from "react";
import ProfilePage from "@/components/pages/auth/profile/Profile";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (!isAuthenticated) return null;

  return <ProfilePage />;
}
