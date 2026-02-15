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
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo and Name */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-xl font-bold">C</span>
            </div>
            <span className="text-xl font-semibold">Nome</span>
          </div>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-end gap-3 px-3 min-w-40 focus:outline-none focus:ring-0 focus-visible:ring-0 focus:bg-transparent"
              >
                <span className="hidden md:block text-sm font-medium">
                  {user.first_name} {user.last_name}
                </span>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded shadow-sm">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push("/profile")}
              >
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push("/logout")}
                className="text-red-500 hover:bg-gray-50 cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4 text-red-500" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

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
            <TabsTrigger value="users" className="flex items-center gap-2 rounded">
              <Users className="h-4 w-4" />
              <span>Utenti</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2 rounded">
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
