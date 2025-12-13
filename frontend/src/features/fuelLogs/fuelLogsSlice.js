import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fuelLogsService } from '../../services/api';

const initialState = {
  fuelLogs: [],
  loading: false,
  error: null,
};

export const fetchFuelLogs = createAsyncThunk(
  'fuelLogs/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fuelLogsService.getAll();
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement');
    }
  }
);

export const createFuelLog = createAsyncThunk(
  'fuelLogs/create',
  async (fuelLogData, { rejectWithValue }) => {
    try {
      const response = await fuelLogsService.create(fuelLogData);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création');
    }
  }
);

export const updateFuelLog = createAsyncThunk(
  'fuelLogs/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await fuelLogsService.update(id, data);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  }
);

export const deleteFuelLog = createAsyncThunk(
  'fuelLogs/delete',
  async (id, { rejectWithValue }) => {
    try {
      await fuelLogsService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  }
);

const fuelLogsSlice = createSlice({
  name: 'fuelLogs',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFuelLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFuelLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.fuelLogs = action.payload;
      })
      .addCase(fetchFuelLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createFuelLog.fulfilled, (state, action) => {
        state.fuelLogs.push(action.payload);
      })
      .addCase(updateFuelLog.fulfilled, (state, action) => {
        const index = state.fuelLogs.findIndex((f) => f._id === action.payload._id);
        if (index !== -1) {
          state.fuelLogs[index] = action.payload;
        }
      })
      .addCase(deleteFuelLog.fulfilled, (state, action) => {
        state.fuelLogs = state.fuelLogs.filter((f) => f._id !== action.payload);
      });
  },
});

export const { clearError } = fuelLogsSlice.actions;
export default fuelLogsSlice.reducer;
