"use client";

import AdminDashboard from "@/components/pages/dashboard/AdminDashboard";

export default function AdminDemoPage() {
    // Mock admin user
    const mockAdminUser = {
        id: "admin123",
        first_name: "Admin",
        last_name: "User",
        email: "admin@test.com",
        role: "administrator",
    };

    return <AdminDashboard user={mockAdminUser} />;
}
