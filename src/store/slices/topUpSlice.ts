import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import { fetchBalance } from './balanceSlice';
import { topUp } from '../../services/api';

interface TopUpState {
  loading: boolean;
  error: string | null;
}

const initialState: TopUpState = {
  loading: false,
  error: null,
};

export const processTopUp = createAsyncThunk(
  'topup/processTopUp',
  async (amount: number, { dispatch, rejectWithValue }) => {
    try {
      const cleanAmount = Math.abs(Math.floor(amount));
      const response = await topUp(cleanAmount);

      if (response.data.status === 0) {
        toast.success(response.data.message);
        dispatch(fetchBalance());
        return response.data;
      }
      
      throw new Error(response.data.message);
    } catch (error: any) {
      const message = error.response?.data?.message || 
                     error.message || 
                     'Top Up gagal';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const topUpSlice = createSlice({
  name: 'topup',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(processTopUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processTopUp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(processTopUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default topUpSlice.reducer;
