import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { pneusService } from '../../services/api';

const initialState = {
  pneus: [],
  loading: false,
  error: null,
};

export const fetchPneus = createAsyncThunk(
  'pneus/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await pneusService.getAll();
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement');
    }
  }
);

export const createPneu = createAsyncThunk(
  'pneus/create',
  async (pneuData, { rejectWithValue }) => {
    try {
      const response = await pneusService.create(pneuData);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création');
    }
  }
);

export const updatePneu = createAsyncThunk(
  'pneus/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await pneusService.update(id, data);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  }
);

export const deletePneu = createAsyncThunk(
  'pneus/delete',
  async (id, { rejectWithValue }) => {
    try {
      await pneusService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  }
);

const pneusSlice = createSlice({
  name: 'pneus',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPneus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPneus.fulfilled, (state, action) => {
        state.loading = false;
        state.pneus = action.payload;
      })
      .addCase(fetchPneus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPneu.fulfilled, (state, action) => {
        state.pneus.push(action.payload);
      })
      .addCase(updatePneu.fulfilled, (state, action) => {
        const index = state.pneus.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.pneus[index] = action.payload;
        }
      })
      .addCase(deletePneu.fulfilled, (state, action) => {
        state.pneus = state.pneus.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearError } = pneusSlice.actions;
export default pneusSlice.reducer;
