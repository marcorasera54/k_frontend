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
import { Bell, CheckCheck, Filter, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const handleMarkRead = (id: string) => {
    dispatch(markNotificationRead(id));
  };

  const handleMarkAll = () => {
    dispatch(markAllNotificationsRead());
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.is_read;
    return n.type === activeTab;
  });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader user={user} />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Notifiche</h1>
            </div>
          </div>

          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAll}
              className="gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              Segna tutte come lette
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as FilterTab)}
          className="mb-4"
        >
          <TabsList className="flex-wrap h-auto gap-1 bg-muted/50 p-1">
            <TabsTrigger value="all" className="text-xs cursor-pointer">
              Tutte
              <Badge variant="secondary" className="ml-1.5 text-xs px-1.5">
                {notifications.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs cursor-pointer">
              Non lette
              {unreadCount > 0 && (
                <Badge className="ml-1.5 text-xs px-1.5 bg-red-500 text-white border-0">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            {Object.entries(NOTIFICATION_CONFIG).map(([type, config]) => (
              <TabsTrigger
                key={type}
                value={type}
                className="text-xs cursor-pointer"
              >
                {config.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Notification List */}
        {isLoading ? (
          <NotificationSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState tab={activeTab} />
        ) : (
          <div className="flex flex-col gap-2">
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
      className={`flex gap-4 items-start p-4 rounded-lg border transition-all
        ${n.is_read ? "bg-background border-border" : `${bgColor} border cursor-pointer`}
      `}
    >
      {/* Icon bubble */}
      <div
        className={`shrink-0 flex h-10 w-10 items-center justify-center bg-background ${n.is_read ? "" : "shadow-sm"}`}
      >
        <Icon className={`h-5.5 w-5.5 ${iconColor}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className={`text-sm leading-tight ${n.is_read ? "font-normal" : "font-semibold"}`}
            >
              {n.title}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5 leading-snug">
              {n.message}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {!n.is_read && (
              <span className={`h-2 w-2 rounded-full mt-1 ${dotColor}`} />
            )}
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(new Date(n.created_at), {
                addSuffix: true,
                locale: it,
              })}{" "}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground/60 mt-1">
          {format(new Date(n.created_at), "d MMM yyyy · HH:mm", { locale: it })}
        </p>
      </div>
    </div>
  );
}

function EmptyState({ tab }: { tab: FilterTab }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
        <Inbox className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-base font-medium mb-1">
        {tab === "unread"
          ? "Nessuna notifica non letta"
          : "Nessuna notifica"}{" "}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs">
        {tab === "unread"
          ? "Sei in pari! Ricontrolla più tardi."
          : "Le notifiche che ricevi appariranno qui."}
      </p>
    </div>
  );
}

function NotificationSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4 items-start p-4 rounded-lg border">
          <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
