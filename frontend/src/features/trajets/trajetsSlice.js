import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { trajetsService } from '../../services/api';

const initialState = {
  trajets: [],
  currentTrajet: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchTrajets = createAsyncThunk(
  'trajets/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await trajetsService.getAll(filters);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement');
    }
  }
);

export const fetchTrajetById = createAsyncThunk(
  'trajets/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await trajetsService.getById(id);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement');
    }
  }
);

export const createTrajet = createAsyncThunk(
  'trajets/create',
  async (trajetData, { rejectWithValue }) => {
    try {
      const response = await trajetsService.create(trajetData);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création');
    }
  }
);

export const updateTrajet = createAsyncThunk(
  'trajets/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await trajetsService.update(id, data);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  }
);

export const deleteTrajet = createAsyncThunk(
  'trajets/delete',
  async (id, { rejectWithValue }) => {
    try {
      await trajetsService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  }
);

// Slice
const trajetsSlice = createSlice({
  name: 'trajets',
  initialState,
  reducers: {
    clearCurrentTrajet: (state) => {
      state.currentTrajet = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrajets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrajets.fulfilled, (state, action) => {
        state.loading = false;
        state.trajets = action.payload;
      })
      .addCase(fetchTrajets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTrajetById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrajetById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTrajet = action.payload;
      })
      .addCase(fetchTrajetById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTrajet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrajet.fulfilled, (state, action) => {
        state.loading = false;
        state.trajets.push(action.payload);
      })
      .addCase(createTrajet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTrajet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrajet.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.trajets.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.trajets[index] = action.payload;
        }
        if (state.currentTrajet?._id === action.payload._id) {
          state.currentTrajet = action.payload;
        }
      })
      .addCase(updateTrajet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTrajet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrajet.fulfilled, (state, action) => {
        state.loading = false;
        state.trajets = state.trajets.filter((t) => t._id !== action.payload);
        if (state.currentTrajet?._id === action.payload) {
          state.currentTrajet = null;
        }
      })
      .addCase(deleteTrajet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentTrajet, clearError } = trajetsSlice.actions;
export default trajetsSlice.reducer;
