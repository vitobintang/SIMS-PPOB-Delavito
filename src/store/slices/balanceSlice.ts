import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBalance } from '../../services/api';
import { toast } from 'react-hot-toast';

interface BalanceState {
  balance: number;
  loading: boolean;
  error: string | null;
}

const initialState: BalanceState = {
  balance: 0,
  loading: false,
  error: null,
};

export const fetchBalance = createAsyncThunk(
  'balance/fetchBalance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getBalance();
      return response.data.data.balance;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch balance');
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch balance');
    }
  }
);

const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default balanceSlice.reducer;
