"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/components/api/connectors/notificationApi";
import { Notification, NotificationType } from "@/lib/types/notification";
import { NOTIFICATION_CONFIG } from "@/components/pages/notifications/NotificationUtils";
import { formatDistanceToNow, format } from "date-fns";
import { Bell, CheckCheck, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AppHeader from "@/components/layout/AppHeader";
import { useAppSelector as useSelector } from "@/store/hooks";
import { it } from "date-fns/locale";

type FilterTab = "all" | "unread" | NotificationType;

export default function NotificationsPage() {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, isLoading } = useAppSelector(
    (s) => s.notifications,
  );
  const { user } = useSelector((s) => s.auth);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkRead = (id: string) => dispatch(markNotificationRead(id));
  const handleMarkAll = () => dispatch(markAllNotificationsRead());

  const filtered = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.is_read;
    return n.type === activeTab;
  });

  const tabs: { value: FilterTab; label: string; count?: number }[] = [
    { value: "all", label: "Tutte", count: notifications.length },
    { value: "unread", label: "Non lette", count: unreadCount || undefined },
    ...Object.entries(NOTIFICATION_CONFIG).map(([type, config]) => ({
      value: type as FilterTab,
      label: config.label,
    })),
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} />

      <main className="max-w-3xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold">Notifiche</h1>
              {unreadCount > 0 && (
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {unreadCount} non {unreadCount === 1 ? "letta" : "lette"}
                </p>
              )}
            </div>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAll}
              className="gap-2 self-start sm:self-auto text-xs sm:text-sm shrink-0"
            >
              <CheckCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Segna tutte come lette</span>
              <span className="xs:hidden">Segna tutte</span>
            </Button>
          )}
        </div>

        {/* Filter Tabs — horizontal scroll on mobile */}
        <div className="mb-3 sm:mb-4 -mx-3 sm:mx-0">
          <div className="flex gap-1.5 overflow-x-auto px-3 sm:px-0 pb-1 sm:pb-0 scrollbar-hide sm:flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium
                  whitespace-nowrap transition-all shrink-0
                  ${
                    activeTab === tab.value
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }
                `}
              >
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className={`
                      inline-flex items-center justify-center rounded-full text-[10px] font-bold
                      min-w-[16px] h-4 px-1
                      ${
                        activeTab === tab.value
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : tab.value === "unread"
                            ? "bg-red-500 text-white"
                            : "bg-background text-foreground"
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Notification List */}
        {isLoading ? (
          <NotificationSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <div className="flex flex-col gap-1.5 sm:gap-2">
            {filtered.map((n) => (
              <NotificationCard
                key={n._id}
                notification={n}
                onMarkRead={handleMarkRead}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function NotificationCard({
  notification: n,
  onMarkRead,
}: {
  notification: Notification;
  onMarkRead: (id: string) => void;
}) {
  const config = NOTIFICATION_CONFIG[n.type] ?? {
    bgColor: "bg-gray-50 border-gray-100",
    dotColor: "bg-gray-400",
    iconColor: "text-gray-500",
    Icon: Bell,
    label: "Notification",
  };

  const { Icon, iconColor, dotColor, bgColor } = config;

  return (
    <div
      onClick={() => !n.is_read && onMarkRead(n._id)}
      className={`
        flex gap-3 sm:gap-4 items-start p-3 sm:p-4 rounded-lg border transition-all
        ${
          n.is_read
            ? "bg-background border-border"
            : `${bgColor} border cursor-pointer active:scale-[0.99]`
        }
      `}
    >
      {/* Icon bubble */}
      <div className="shrink-0 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center">
        <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm leading-tight truncate sm:whitespace-normal ${
                n.is_read ? "font-normal" : "font-semibold"
              }`}
            >
              {n.title}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 leading-snug line-clamp-2">
              {n.message}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            {!n.is_read && (
              <span className={`h-2 w-2 rounded-full mt-0.5 ${dotColor}`} />
            )}
            <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(new Date(n.created_at), {
                addSuffix: true,
                locale: it,
              })}
            </span>
          </div>
        </div>

        <p className="text-[10px] sm:text-xs text-muted-foreground/60 mt-1">
          {format(new Date(n.created_at), "d MMM yyyy · HH:mm", {
            locale: it,
          })}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: FilterTab }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-center px-4">
      <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-muted mb-4">
        <Inbox className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground" />
      </div>
      <h3 className="text-sm sm:text-base font-medium mb-1">
        {tab === "unread" ? "Nessuna notifica non letta" : "Nessuna notifica"}
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
        {tab === "unread"
          ? "Sei in pari! Ricontrolla più tardi."
          : "Le notifiche che ricevi appariranno qui."}
      </p>
    </div>
  );
}

function NotificationSkeleton() {
  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex gap-3 sm:gap-4 items-start p-3 sm:p-4 rounded-lg border"
        >
          <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 sm:h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-2.5 sm:h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
