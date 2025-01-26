import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';
import { Transaction } from '../../types';
import { toast } from 'react-hot-toast';

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  filters: {
    month: number | null;
    type: 'ALL' | 'TOPUP' | 'PAYMENT';
  };
}

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
  hasMore: true,
  filters: {
    month: null,
    type: 'ALL',
  },
};

export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async ({ offset, limit }: { offset: number; limit: number }) => {
    try {
      const response = await api.getTransactionHistory(offset, limit);
      return {
        transactions: response.data.data.records || [], // Add fallback empty array
        offset,
        limit,
      };
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch transactions');
      throw error;
    }
  }
);

export const makeTransaction = createAsyncThunk(
  'transactions/makeTransaction',
  async (serviceCode: string) => {
    try {
      const response = await api.makeTransaction(serviceCode);
      toast.success('Transaction successful!');
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Transaction failed');
      throw error;
    }
  }
);

export const topUp = createAsyncThunk(
  'transactions/topUp',
  async (amount: number) => {
    try {
      const response = await api.topUp(amount);
      toast.success('Top up successful!');
      return response.data.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Top up failed');
      throw error;
    }
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearTransactions: (state) => {
      state.transactions = [];
      state.hasMore = true;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.transactions = [];
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        const { transactions, offset } = action.payload;
        if (offset === 0) {
          state.transactions = transactions;
        } else {
          state.transactions = [...state.transactions, ...transactions];
        }
        state.hasMore = transactions.length > 0;
        state.loading = false;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch transactions';
      })
      .addCase(makeTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(makeTransaction.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(makeTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Transaction failed';
      })
      .addCase(topUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(topUp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(topUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Top up failed';
      });
  },
});

export const { clearTransactions, setFilters } = transactionsSlice.actions;
export default transactionsSlice.reducer;