import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/components/api/api";
import { Notification } from "@/lib/types/notification";

export const fetchNotifications = createAsyncThunk<
  Notification[],
  void,
  { rejectValue: string }
>("notifications/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/notifications/get-notifications");
    return res.data;
  } catch {
    return rejectWithValue("Failed to fetch notifications");
  }
});

export const markNotificationRead = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("notifications/markRead", async (id, { rejectWithValue }) => {
  try {
    await api.patch(`/notifications/${id}/read`);
    return id;
  } catch {
    return rejectWithValue("Failed to mark as read");
  }
});

export const markAllNotificationsRead = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>("notifications/markAllRead", async (_, { rejectWithValue }) => {
  try {
    await api.patch("/notifications/read-all");
  } catch {
    return rejectWithValue("Failed to mark all as read");
  }
});

export const fetchUnreadCount = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>("notifications/fetchUnreadCount", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/notifications/unread-count");
    return res.data.count;
  } catch {
    return rejectWithValue("Failed to fetch unread count");
  }
});
