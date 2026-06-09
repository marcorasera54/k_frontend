"use client";

import { User as UserIcon, LogOut, CalendarClock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUserInitials } from "@/lib/utils";
import { User } from "@/lib/types/auth";
import { useRouter } from "next/navigation";
import NotificationBell from "../pages/notifications/NotificationBell";
import Image from "next/image";

interface AppHeaderProps {
  user: User | null;
}

export default function AppHeader({ user }: AppHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div
          onClick={() => router.push(user ? "/fields" : "/")}
          className="flex items-center gap-1 cursor-pointer"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg overflow-hidden">
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>

          <span className="text-xl font-semibold">Sportivo</span>
        </div>
        <div className="flex items-center gap-1">
          <NotificationBell />

          {/* User dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-end gap-3 px-2 md:px-3 md:min-w-40 hover:bg-transparent focus:outline-none focus:ring-0 focus-visible:ring-0"
              >
                <span className="hidden md:block text-sm font-medium">
                  {user?.first_name} {user?.last_name}
                </span>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52 rounded shadow-sm">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.first_name} {user?.last_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push("/dashboard")}
              >
                <CalendarClock className="mr-1 h-4 w-4" />
                <span>Le mie prenotazioni</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => router.push("/profile")}
              >
                <UserIcon className="mr-1 h-4 w-4" />
                <span>Profilo</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => router.push("/logout")}
                className="hover:bg-gray-50 cursor-pointer"
              >
                <LogOut className="mr-1 h-4 w-4 text-red-500" />
                <span className="text-red-500">Esci</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
