import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { maintenancesService } from '../../services/api';

const initialState = {
  maintenances: [],
  currentMaintenance: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchMaintenances = createAsyncThunk(
  'maintenances/fetchAll',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await maintenancesService.getAll(filters);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement');
    }
  }
);

export const fetchMaintenanceById = createAsyncThunk(
  'maintenances/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await maintenancesService.getById(id);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement');
    }
  }
);

export const createMaintenance = createAsyncThunk(
  'maintenances/create',
  async (maintenanceData, { rejectWithValue }) => {
    try {
      const response = await maintenancesService.create(maintenanceData);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création');
    }
  }
);

export const updateMaintenance = createAsyncThunk(
  'maintenances/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await maintenancesService.update(id, data);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  }
);

export const deleteMaintenance = createAsyncThunk(
  'maintenances/delete',
  async (id, { rejectWithValue }) => {
    try {
      await maintenancesService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  }
);

export const demarrerMaintenance = createAsyncThunk(
  'maintenances/demarrer',
  async (id, { rejectWithValue }) => {
    try {
      const response = await maintenancesService.demarrer(id);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du démarrage');
    }
  }
);

export const terminerMaintenance = createAsyncThunk(
  'maintenances/terminer',
  async (id, { rejectWithValue }) => {
    try {
      const response = await maintenancesService.terminer(id);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la finalisation');
    }
  }
);

// Slice
const maintenancesSlice = createSlice({
  name: 'maintenances',
  initialState,
  reducers: {
    clearCurrentMaintenance: (state) => {
      state.currentMaintenance = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaintenances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaintenances.fulfilled, (state, action) => {
        state.loading = false;
        state.maintenances = action.payload;
      })
      .addCase(fetchMaintenances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMaintenanceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaintenanceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMaintenance = action.payload;
      })
      .addCase(fetchMaintenanceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMaintenance.fulfilled, (state, action) => {
        state.maintenances.push(action.payload);
      })
      .addCase(updateMaintenance.fulfilled, (state, action) => {
        const index = state.maintenances.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) {
          state.maintenances[index] = action.payload;
        }
      })
      .addCase(deleteMaintenance.fulfilled, (state, action) => {
        state.maintenances = state.maintenances.filter((m) => m._id !== action.payload);
      })
      .addCase(demarrerMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(demarrerMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.maintenances.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) {
          state.maintenances[index] = action.payload;
        }
        if (state.currentMaintenance?._id === action.payload._id) {
          state.currentMaintenance = action.payload;
        }
      })
      .addCase(demarrerMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(terminerMaintenance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(terminerMaintenance.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.maintenances.findIndex((m) => m._id === action.payload._id);
        if (index !== -1) {
          state.maintenances[index] = action.payload;
        }
        if (state.currentMaintenance?._id === action.payload._id) {
          state.currentMaintenance = action.payload;
        }
      })
      .addCase(terminerMaintenance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentMaintenance, clearError } = maintenancesSlice.actions;
export default maintenancesSlice.reducer;
