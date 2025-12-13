import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { camionsService } from '../../services/api';

// Initial state
const initialState = {
  camions: [],
  currentCamion: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCamions = createAsyncThunk(
  'camions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await camionsService.getAll();
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement');
    }
  }
);

export const fetchCamionById = createAsyncThunk(
  'camions/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await camionsService.getById(id);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement');
    }
  }
);

export const createCamion = createAsyncThunk(
  'camions/create',
  async (camionData, { rejectWithValue }) => {
    try {
      const response = await camionsService.create(camionData);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création');
    }
  }
);

export const updateCamion = createAsyncThunk(
  'camions/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await camionsService.update(id, data);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  }
);

export const deleteCamion = createAsyncThunk(
  'camions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await camionsService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  }
);

// Slice
const camionsSlice = createSlice({
  name: 'camions',
  initialState,
  reducers: {
    clearCurrentCamion: (state) => {
      state.currentCamion = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchCamions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCamions.fulfilled, (state, action) => {
        state.loading = false;
        state.camions = action.payload;
      })
      .addCase(fetchCamions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by id
      .addCase(fetchCamionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCamionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCamion = action.payload;
      })
      .addCase(fetchCamionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createCamion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCamion.fulfilled, (state, action) => {
        state.loading = false;
        state.camions.push(action.payload);
      })
      .addCase(createCamion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update
      .addCase(updateCamion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCamion.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.camions.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.camions[index] = action.payload;
        }
        if (state.currentCamion?._id === action.payload._id) {
          state.currentCamion = action.payload;
        }
      })
      .addCase(updateCamion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete
      .addCase(deleteCamion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCamion.fulfilled, (state, action) => {
        state.loading = false;
        state.camions = state.camions.filter((c) => c._id !== action.payload);
        if (state.currentCamion?._id === action.payload) {
          state.currentCamion = null;
        }
      })
      .addCase(deleteCamion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentCamion, clearError } = camionsSlice.actions;
export default camionsSlice.reducer;
