"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { UserRole } from "@/lib/types/auth";
import FieldManagerDashboard from "@/components/pages/dashboard/FieldManagerDashboard";
import AdminDashboard from "@/components/pages/dashboard/AdminDashboard";
import UserDashboard from "@/components/pages/dashboard/UserDashboard";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  switch (user.role) {
    case UserRole.FIELD_MANAGER:
      return <FieldManagerDashboard user={user} />;
    case UserRole.ADMIN:
      return <AdminDashboard user={user} />;
    case UserRole.USER:
    default:
      return <UserDashboard user={user} />;
  }
}
