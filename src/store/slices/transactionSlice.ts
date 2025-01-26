import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { makeTransaction } from '../../services/api';
import { toast } from 'react-hot-toast';
import { fetchBalance } from './balanceSlice';

interface TransactionState {
  loading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  loading: false,
  error: null,
};

export const processPayment = createAsyncThunk(
  'transaction/processPayment',
  async (serviceCode: string, { dispatch, rejectWithValue }) => {
    try {
      const response = await makeTransaction(serviceCode);
      
      if (response.data.status === 0) {
        toast.success('Pembayaran berhasil');
        dispatch(fetchBalance()); // Refresh balance after payment
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Pembayaran gagal';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processPayment.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default transactionSlice.reducer;
