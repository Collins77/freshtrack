import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchEntries = createAsyncThunk(
  'stock/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await api.get('/stock', { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const fetchSummary = createAsyncThunk(
  'stock/fetchSummary',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/stock/summary');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const createEntry = createAsyncThunk(
  'stock/create',
  async (entryData, { rejectWithValue }) => {
    try {
      const res = await api.post('/stock', entryData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const updateEntry = createAsyncThunk(
  'stock/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/stock/${id}`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

export const deleteEntry = createAsyncThunk(
  'stock/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/stock/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);

const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    entries: [],
    summary: null,
    loading: false,
    error: null,
    total: 0,
    pages: 1,
    currentPage: 1,
  },
  reducers: {
    clearStockError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchEntries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload.data.entries;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Summary
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.summary = action.payload.data;
      })
      // Create
      .addCase(createEntry.fulfilled, (state, action) => {
        state.entries.unshift(action.payload.data.entry);
      })
      // Update
      .addCase(updateEntry.fulfilled, (state, action) => {
        const index = state.entries.findIndex(
          (e) => e.id === action.payload.data.entry.id
        );
        if (index !== -1) {
          state.entries[index] = action.payload.data.entry;
        }
      })
      // Delete
      .addCase(deleteEntry.fulfilled, (state, action) => {
        state.entries = state.entries.filter((e) => e.id !== action.payload);
      });
  },
});

export const { clearStockError } = stockSlice.actions;
export default stockSlice.reducer;