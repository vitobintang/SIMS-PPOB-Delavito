import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import servicesReducer from './slices/servicesSlice';
import bannersReducer from './slices/bannersSlice';
import transactionsReducer from './slices/transactionsSlice';
import balanceReducer from './slices/balanceSlice';
import topUpReducer from './slices/topUpSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    services: servicesReducer,
    banners: bannersReducer,
    transactions: transactionsReducer,
    balance: balanceReducer,
    topUp: topUpReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;