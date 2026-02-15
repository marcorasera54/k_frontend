import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import fieldReducer from "./slices/fieldSlice";
import bookingReducer from "./slices/bookingSlice";
import sportsCentersReducer from "./slices/sportsCenterSlice";
import availabilityReducer from "./slices/availabilitySlice";
import profileReducer from "./slices/profileSlice";

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"],
  blacklist: ["error", "isLoading"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: persistedAuthReducer,
      fields: fieldReducer,
      bookings: bookingReducer,
      sportsCenters: sportsCentersReducer,
      availability: availabilityReducer,
      profile: profileReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
