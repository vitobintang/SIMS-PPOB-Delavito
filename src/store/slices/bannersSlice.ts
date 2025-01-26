import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../services/api';
import { Banner } from '../../types';
import { toast } from 'react-hot-toast';

interface BannersState {
  banners: Banner[];
  loading: boolean;
  error: string | null;
}

const initialState: BannersState = {
  banners: [],
  loading: false,
  error: null,
};

export const fetchBanners = createAsyncThunk('banners/fetchBanners', async () => {
  try {
    const response = await api.getBanners();
    return response.data.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to fetch banners');
    throw error;
  }
});

const bannersSlice = createSlice({
  name: 'banners',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.banners = action.payload;
        state.loading = false;
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch banners';
      });
  },
});

export default bannersSlice.reducer;