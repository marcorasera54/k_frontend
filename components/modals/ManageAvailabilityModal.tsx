"use client";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createAvailability,
  fetchFieldAvailability,
  deleteAvailability,
  createBlockedSlot,
  fetchFieldBlockedSlots,
  deleteBlockedSlot,
} from "@/components/api/connectors/availabilityApi";
import { DayOfWeek } from "@/lib/types/availability";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, Clock, Ban, Trash2 } from "lucide-react";

interface ManageAvailabilityModalProps {
  fieldId: string;
  fieldName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ManageAvailabilityModal({
  fieldId,
  fieldName,
  isOpen,
  onClose,
}: ManageAvailabilityModalProps) {
  const dispatch = useAppDispatch();
  const { availabilities, blockedSlots, isLoading } = useAppSelector(
    (state) => state.availability,
  );
  const [activeTab, setActiveTab] = useState<"schedule" | "blocked">(
    "schedule",
  );
  const [error, setError] = useState<string | null>(null);

  const [scheduleForm, setScheduleForm] = useState({
    day_of_week: DayOfWeek.MONDAY,
    operating_hours: {
      start_time: "09:00",
      end_time: "17:00",
      slot_duration_minutes: 60,
    },
  });

  const [blockedForm, setBlockedForm] = useState({
    blocked_date: "",
    start_time: "09:00",
    end_time: "10:00",
    reason: "",
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchFieldAvailability(fieldId));
      dispatch(fetchFieldBlockedSlots(fieldId));
    }
  }, [isOpen, fieldId, dispatch]);

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await dispatch(
        createAvailability({
          field_id: fieldId,
          ...scheduleForm,
        }),
      ).unwrap();

      alert(
        "Operating hours created successfully! Slots will be auto-generated.",
      );
      setScheduleForm({
        day_of_week: DayOfWeek.MONDAY,
        operating_hours: {
          start_time: "09:00",
          end_time: "17:00",
          slot_duration_minutes: 60,
        },
      });
    } catch (err: any) {
      setError(err || "Failed to create operating hours");
    }
  };

  const handleDeleteSchedule = async (availabilityId: string) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;

    try {
      await dispatch(deleteAvailability(availabilityId)).unwrap();
      alert("Schedule deleted successfully!");
    } catch (err: any) {
      alert(err || "Failed to delete schedule");
    }
  };

  const handleCreateBlockedSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await dispatch(
        createBlockedSlot({
          field_id: fieldId,
          ...blockedForm,
        }),
      ).unwrap();

      alert("Time slot blocked successfully!");
      setBlockedForm({
        blocked_date: "",
        start_time: "09:00",
        end_time: "10:00",
        reason: "",
      });
    } catch (err: any) {
      setError(err || "Failed to block time slot");
    }
  };

  const handleDeleteBlockedSlot = async (blockedSlotId: string) => {
    if (!confirm("Are you sure you want to remove this blocked slot?")) return;

    try {
      await dispatch(deleteBlockedSlot(blockedSlotId)).unwrap();
      alert("Blocked slot removed successfully!");
    } catch (err: any) {
      alert(err || "Failed to remove blocked slot");
    }
  };

  const calculateTotalSlots = (
    startTime: string,
    endTime: string,
    duration: number,
  ) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const totalMinutes = endMinutes - startMinutes;
    return Math.floor(totalMinutes / duration);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Manage Availability</DialogTitle>
          <DialogDescription>{fieldName}</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "schedule" | "blocked")
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Operating Hours
            </TabsTrigger>
            <TabsTrigger value="blocked" className="flex items-center gap-2">
              <Ban className="h-4 w-4" />
              Blocked Slots
            </TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-6 mt-6">
            {/* Create Schedule Form */}
            <Card>
              <CardHeader>
                <CardTitle>Set Operating Hours</CardTitle>
                <CardDescription>
                  Booking slots will be automatically generated based on your
                  operating hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSchedule} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="day_of_week">
                      Day of Week <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      required
                      value={scheduleForm.day_of_week}
                      onValueChange={(value) =>
                        setScheduleForm({
                          ...scheduleForm,
                          day_of_week: value as DayOfWeek,
                        })
                      }
                    >
                      <SelectTrigger id="day_of_week">
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(DayOfWeek).map((day) => (
                          <SelectItem key={day} value={day}>
                            {day.charAt(0).toUpperCase() + day.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_time">
                        Opening Time <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="start_time"
                        type="time"
                        required
                        value={scheduleForm.operating_hours.start_time}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            operating_hours: {
                              ...scheduleForm.operating_hours,
                              start_time: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_time">
                        Closing Time <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="end_time"
                        type="time"
                        required
                        value={scheduleForm.operating_hours.end_time}
                        onChange={(e) =>
                          setScheduleForm({
                            ...scheduleForm,
                            operating_hours: {
                              ...scheduleForm.operating_hours,
                              end_time: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slot_duration">
                      Slot Duration (minutes){" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      required
                      value={scheduleForm.operating_hours.slot_duration_minutes.toString()}
                      onValueChange={(value) =>
                        setScheduleForm({
                          ...scheduleForm,
                          operating_hours: {
                            ...scheduleForm.operating_hours,
                            slot_duration_minutes: parseInt(value),
                          },
                        })
                      }
                    >
                      <SelectTrigger id="slot_duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="90">1.5 hours</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      This will generate{" "}
                      {calculateTotalSlots(
                        scheduleForm.operating_hours.start_time,
                        scheduleForm.operating_hours.end_time,
                        scheduleForm.operating_hours.slot_duration_minutes,
                      )}{" "}
                      slots
                    </p>
                  </div>

                  <Button type="submit" className="w-full">
                    Set Operating Hours
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Schedules */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Current Operating Hours
              </h3>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading...
                </div>
              ) : availabilities.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8 text-muted-foreground">
                    No operating hours configured yet
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {availabilities.map((availability) => (
                    <Card key={availability._id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium capitalize">
                              {availability.day_of_week}
                            </h4>
                            <div className="mt-2 text-sm text-muted-foreground space-y-1">
                              <p>
                                {availability.operating_hours.start_time} -{" "}
                                {availability.operating_hours.end_time}
                              </p>
                              <p className="text-xs">
                                {
                                  availability.operating_hours
                                    .slot_duration_minutes
                                }{" "}
                                min slots (
                                {calculateTotalSlots(
                                  availability.operating_hours.start_time,
                                  availability.operating_hours.end_time,
                                  availability.operating_hours
                                    .slot_duration_minutes,
                                )}{" "}
                                slots total)
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDeleteSchedule(availability._id)
                            }
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="blocked" className="space-y-6 mt-6">
            {/* Create Blocked Slot Form */}
            <Card>
              <CardHeader>
                <CardTitle>Block Time Slot</CardTitle>
                <CardDescription>
                  Block specific time slots for maintenance, events, or other
                  reasons.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateBlockedSlot} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="blocked_date">
                      Date <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="blocked_date"
                      type="date"
                      required
                      value={blockedForm.blocked_date}
                      onChange={(e) =>
                        setBlockedForm({
                          ...blockedForm,
                          blocked_date: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="blocked_start_time">
                        Start Time <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="blocked_start_time"
                        type="time"
                        required
                        value={blockedForm.start_time}
                        onChange={(e) =>
                          setBlockedForm({
                            ...blockedForm,
                            start_time: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="blocked_end_time">
                        End Time <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="blocked_end_time"
                        type="time"
                        required
                        value={blockedForm.end_time}
                        onChange={(e) =>
                          setBlockedForm({
                            ...blockedForm,
                            end_time: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason (Optional)</Label>
                    <Input
                      id="reason"
                      type="text"
                      value={blockedForm.reason}
                      onChange={(e) =>
                        setBlockedForm({
                          ...blockedForm,
                          reason: e.target.value,
                        })
                      }
                      placeholder="e.g., Maintenance, Private Event, etc."
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Block Time Slot
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Existing Blocked Slots */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Blocked Time Slots
              </h3>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading...
                </div>
              ) : blockedSlots.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8 text-muted-foreground">
                    No blocked time slots
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {blockedSlots.map((blocked) => (
                    <Card key={blocked._id}>
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">
                              {new Date(
                                blocked.blocked_date,
                              ).toLocaleDateString()}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {blocked.start_time} - {blocked.end_time}
                            </p>
                            {blocked.reason && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {blocked.reason}
                              </p>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteBlockedSlot(blocked._id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
