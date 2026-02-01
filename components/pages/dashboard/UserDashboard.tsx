"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMyBookings,
  cancelBooking,
} from "@/components/api/connectors/bookingApi";
import { fetchFields } from "@/components/api/connectors/fieldApi";
import { BookingStatus } from "@/lib/types/booking";
import { User } from "@/lib/types/auth";
import { format } from "date-fns";
import FieldBookingModal from "@/components/modals/FieldBookingModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Calendar, MapPin, DollarSign, User as UserIcon, LogOut, Settings } from "lucide-react";

interface UserDashboardProps {
  user: User;
}

export default function UserDashboard({ user }: UserDashboardProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { bookings, isLoading: bookingsLoading } = useAppSelector(
    (state) => state.bookings,
  );
  const { fields } = useAppSelector((state) => state.fields);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<any | null>(null);

  useEffect(() => {
    dispatch(fetchMyBookings());
    dispatch(fetchFields({ is_active: true }));
  }, [dispatch]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setCancelling(bookingId);
    try {
      await dispatch(cancelBooking(bookingId)).unwrap();
      alert("Booking cancelled successfully");
    } catch (error: any) {
      alert(error || "Failed to cancel booking");
    } finally {
      setCancelling(null);
    }
  };

  const getFieldName = (fieldId: string) => {
    const field = fields.find((f) => f._id === fieldId);
    return field?.name || "Unknown Field";
  };

  const getStatusVariant = (status: BookingStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return "default";
      case BookingStatus.PENDING:
        return "secondary";
      case BookingStatus.CANCELLED:
        return "destructive";
      default:
        return "outline";
    }
  };

  const getUserInitials = () => {
    return `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-6">
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
              <Button variant="ghost" className="flex items-center gap-3 px-3">
                <span className="hidden md:block text-sm font-medium">
                  {user.first_name} {user.last_name}
                </span>
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
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
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/logout")} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome, {user.first_name}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your bookings and explore available fields
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Bookings
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {bookings.filter((b) => b.status === BookingStatus.CONFIRMED).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Fields
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {fields.length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Bookings Section */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">My Bookings</CardTitle>
            <Button onClick={() => router.push("/fields")}>
              Book a Field
            </Button>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Loading bookings...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  No bookings yet. Book your first field!
                </p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Field</TableHead>
                      <TableHead>Start Time</TableHead>
                      <TableHead>End Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking._id}>
                        <TableCell className="font-medium">
                          {getFieldName(booking.field_id)}
                        </TableCell>
                        <TableCell>
                          {format(new Date(booking.start_time), "MMM dd, yyyy HH:mm")}
                        </TableCell>
                        <TableCell>
                          {format(new Date(booking.end_time), "MMM dd, yyyy HH:mm")}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(booking.status)}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          ${booking.total_price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          {booking.status !== BookingStatus.CANCELLED && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCancelBooking(booking._id)}
                              disabled={cancelling === booking._id}
                              className="text-destructive hover:text-destructive"
                            >
                              {cancelling === booking._id ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Cancelling...
                                </>
                              ) : (
                                "Cancel"
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Fields Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Available Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map((field) => (
                <Card key={field._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{field.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize mt-1">
                          {field.sport_type}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-2">
                        Active
                      </Badge>
                    </div>
                    {field.description && (
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {field.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="flex items-center gap-1 text-primary">
                        <DollarSign className="h-5 w-5" />
                        <span className="text-2xl font-bold">{field.hourly_rate}</span>
                        <span className="text-sm text-muted-foreground">/hr</span>
                      </div>
                      <Button onClick={() => setSelectedField(field)}>
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Booking Modal */}
        {selectedField && (
          <FieldBookingModal
            field={selectedField}
            isOpen={!!selectedField}
            onClose={() => setSelectedField(null)}
          />
        )}
      </main>
    </div>
  );
}