import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import camionsReducer from '../features/camions/camionsSlice';
import trajetsReducer from '../features/trajets/trajetsSlice';
import maintenancesReducer from '../features/maintenances/maintenancesSlice';
import remorquesReducer from '../features/remorques/remorquesSlice';
import pneusReducer from '../features/pneus/pneusSlice';
import fuelLogsReducer from '../features/fuelLogs/fuelLogsSlice';
import usersReducer from '../features/users/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    camions: camionsReducer,
    trajets: trajetsReducer,
    maintenances: maintenancesReducer,
    remorques: remorquesReducer,
    pneus: pneusReducer,
    fuelLogs: fuelLogsReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
      },
    }),
});

export default store;
