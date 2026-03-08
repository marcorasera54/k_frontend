"use client";

import {
  User as UserIcon,
  LogOut,
  Users,
  FileText,
  Search,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { getUserInitials } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import UsersManagement from "./admin/usersManagement";
import { getAllManagerRequests } from "@/components/api/connectors/managerRequestApi";
import AppHeader from "@/components/layout/AppHeader";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export default function AdminDashboard({ user }: { user: User }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState("users");

  useEffect(() => {
    dispatch(getAllManagerRequests(undefined));
  }, [dispatch]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      <AppHeader user={user} />
      <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Gestisci utenti e richieste di upgrade a Manager
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 rounded">
            <TabsTrigger
              value="users"
              className="flex items-center gap-2 rounded"
            >
              <Users className="h-4 w-4" />
              <span>Utenti</span>
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="flex items-center gap-2 rounded"
            >
              <FileText className="h-4 w-4" />
              <span>Richieste</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <UsersManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
