import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { remorquesService } from '../../services/api';

const initialState = {
  remorques: [],
  currentRemorque: null,
  loading: false,
  error: null,
};

export const fetchRemorques = createAsyncThunk(
  'remorques/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await remorquesService.getAll();
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement');
    }
  }
);

export const createRemorque = createAsyncThunk(
  'remorques/create',
  async (remorqueData, { rejectWithValue }) => {
    try {
      const response = await remorquesService.create(remorqueData);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création');
    }
  }
);

export const updateRemorque = createAsyncThunk(
  'remorques/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await remorquesService.update(id, data);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  }
);

export const deleteRemorque = createAsyncThunk(
  'remorques/delete',
  async (id, { rejectWithValue }) => {
    try {
      await remorquesService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  }
);

const remorquesSlice = createSlice({
  name: 'remorques',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRemorques.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRemorques.fulfilled, (state, action) => {
        state.loading = false;
        state.remorques = action.payload;
      })
      .addCase(fetchRemorques.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createRemorque.fulfilled, (state, action) => {
        state.remorques.push(action.payload);
      })
      .addCase(updateRemorque.fulfilled, (state, action) => {
        const index = state.remorques.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) {
          state.remorques[index] = action.payload;
        }
      })
      .addCase(deleteRemorque.fulfilled, (state, action) => {
        state.remorques = state.remorques.filter((r) => r._id !== action.payload);
      });
  },
});

export const { clearError } = remorquesSlice.actions;
export default remorquesSlice.reducer;
