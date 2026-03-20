"use client";

import { useEffect } from "react";
import UserHome from "@/components/pages/home/UserHome";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";

export default function FieldsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="relative">
      {/* Main Content */}
      <UserHome user={user} />
    </div>
  );
}
