import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export interface ManagerRequest {
    _id: string;
    user_id: string;
    business_name: string;
    business_address: string;
    phone_number: string;
    motivation: string;
    status: "pending" | "approved" | "rejected";
    created_at: string;
    reviewed_at?: string;
    reviewed_by?: string;
    rejection_reason?: string;
}

export interface CreateManagerRequestData {
    business_name: string;
    business_address: string;
    phone_number: string;
    motivation: string;
}

export interface UpdateManagerRequestData {
    status: "approved" | "rejected";
    rejection_reason?: string;
}

// Create a manager role upgrade request
export const createManagerRequest = createAsyncThunk<
    ManagerRequest,
    CreateManagerRequestData
>("managerRequest/create", async (requestData, { rejectWithValue }) => {
    try {
        const response = await api.post("/manager-requests/", requestData);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.detail || "Errore nella creazione della richiesta"
        );
    }
});

// Get current user's manager requests
export const getMyManagerRequests = createAsyncThunk<ManagerRequest[]>(
    "managerRequest/getMy",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/manager-requests/my-requests");
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail || "Errore nel recupero delle richieste"
            );
        }
    }
);

// Get all manager requests (admin only)
export const getAllManagerRequests = createAsyncThunk<
    ManagerRequest[],
    string | undefined
>("managerRequest/getAll", async (status, { rejectWithValue }) => {
    try {
        const params = status ? { status } : {};
        const response = await api.get("/manager-requests/", { params });
        return response.data;
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.detail || "Errore nel recupero delle richieste"
        );
    }
});

// Update manager request (admin only)
export const updateManagerRequest = createAsyncThunk<
    ManagerRequest,
    { requestId: string; updateData: UpdateManagerRequestData }
>(
    "managerRequest/update",
    async ({ requestId, updateData }, { rejectWithValue }) => {
        try {
            const response = await api.put(
                `/manager-requests/${requestId}`,
                updateData
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.detail ||
                "Errore nell'aggiornamento della richiesta"
            );
        }
    }
);
