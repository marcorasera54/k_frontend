"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/components/api/connectors/notificationApi";
import { NOTIFICATION_CONFIG } from "./NotificationUtils";
import { useRouter } from "next/navigation";

export default function NotificationBell() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { notifications, unreadCount } = useAppSelector((s) => s.notifications);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const last5 = notifications.slice(0, 5);

  useEffect(() => {
    dispatch(fetchNotifications());
    intervalRef.current = setInterval(
      () => dispatch(fetchNotifications()),
      60_000,
    );
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [dispatch]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleMarkRead = (id: string) => dispatch(markNotificationRead(id));
  const handleMarkAll = () => dispatch(markAllNotificationsRead());

  const goToInbox = () => {
    setOpen(false);
    router.push("/notifications");
  };

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors cursor-pointer"
        aria-label="Notifiche"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 top-11 z-50 w-80 rounded-lg border bg-background shadow-lg overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Segna tutte come lette
              </button>
            )}
          </div>

          {/* Last 5 */}
          <div className="divide-y max-h-[340px] overflow-y-auto">
            {last5.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <Inbox className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">Nessuna notifica</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Le notifiche appariranno qui
                </p>
              </div>
            ) : (
              last5.map((n) => {
                const config = NOTIFICATION_CONFIG[n.type] ?? {
                  Icon: Bell,
                  iconColor: "text-gray-500",
                  dotColor: "bg-gray-400",
                  bgColor: "",
                  label: "Notifica",
                };
                const { Icon, iconColor, dotColor, bgColor } = config;

                return (
                  <div
                    key={n._id}
                    onClick={() => !n.is_read && handleMarkRead(n._id)}
                    className={`flex gap-3 items-start px-4 py-3 transition-colors ${
                      n.is_read
                        ? "hover:bg-muted/40"
                        : `${bgColor} cursor-pointer`
                    }`}
                  >
                    {/* Icon bubble */}
                    <div className="shrink-0 flex h-8 w-6 items-center justify-center bg-background">
                      <Icon className={`h-4.5 w-4.5 ${iconColor}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm leading-tight ${n.is_read ? "font-medium text-muted-foreground" : "font-semibold"}`}
                      >
                        {n.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                        {n.message}
                      </p>
                    </div>

                    {!n.is_read && (
                      <span
                        className={`shrink-0 mt-2 h-2 w-2 rounded-full ${dotColor}`}
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t px-2 py-1.5">
            <button
              onClick={goToInbox}
              className="flex w-full items-center justify-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors cursor-pointer"
            >
              <Inbox className="h-4 w-4" />
              Vedi tutte le notifiche
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
