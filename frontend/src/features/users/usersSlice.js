import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { usersService } from '../../services/api';

const initialState = {
  users: [],
  currentUser: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await usersService.getAll();
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors du chargement');
    }
  }
);

export const createUser = createAsyncThunk(
  'users/create',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await usersService.create(userData);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la création');
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await usersService.update(id, data);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la mise à jour');
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id, { rejectWithValue }) => {
    try {
      await usersService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;
