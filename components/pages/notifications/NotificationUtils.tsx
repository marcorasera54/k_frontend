import { NotificationType } from "@/lib/types/notification";
import { Clock, XCircle, CalendarPlus, LucideIcon, BadgeCheck } from "lucide-react";

export const NOTIFICATION_CONFIG: Record<
  NotificationType,
  { label: string; dotColor: string; bgColor: string; iconColor: string; Icon: LucideIcon }
> = {
  [NotificationType.BOOKING_CONFIRMED]: {
    label: "Prenotazione confermata",
    dotColor: "bg-green-500",
    bgColor: "bg-green-50 border-green-100",
    iconColor: "text-green-600",
    Icon: BadgeCheck,
  },
  [NotificationType.BOOKING_REMINDER]: {
    label: "Promemoria",
    dotColor: "bg-blue-500",
    bgColor: "bg-blue-50 border-blue-100",
    iconColor: "text-blue-600",
    Icon: Clock,
  },
  [NotificationType.BOOKING_CANCELLED]: {
    label: "Prenotazione annullata",
    dotColor: "bg-red-500",
    bgColor: "bg-red-50 border-red-100",
    iconColor: "text-red-600",
    Icon: XCircle,
  },
  [NotificationType.NEW_BOOKING_RECEIVED]: {
    label: "Nuova prenotazione",
    dotColor: "bg-purple-500",
    bgColor: "bg-purple-50 border-purple-100",
    iconColor: "text-purple-600",
    Icon: CalendarPlus,
  },
};