export { store } from './store';
export { useAppDispatch, useAppSelector } from './hooks';

// Export specific actions from slices to avoid conflicts
export {
  login,
  register,
  logout,
  updateUser,
  clearError as clearAuthError,
} from '../features/auth/authSlice';

export {
  fetchCamions,
  fetchCamionById,
  createCamion,
  updateCamion,
  deleteCamion,
  clearCurrentCamion,
  clearError as clearCamionsError,
} from '../features/camions/camionsSlice';

export {
  fetchTrajets,
  fetchTrajetById,
  createTrajet,
  updateTrajet,
  deleteTrajet,
  clearCurrentTrajet,
  clearError as clearTrajetsError,
} from '../features/trajets/trajetsSlice';

export {
  fetchMaintenances,
  fetchMaintenanceById,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
  clearCurrentMaintenance,
  clearError as clearMaintenancesError,
} from '../features/maintenances/maintenancesSlice';

export {
  fetchRemorques,
  createRemorque,
  updateRemorque,
  deleteRemorque,
  clearError as clearRemorquesError,
} from '../features/remorques/remorquesSlice';

export {
  fetchPneus,
  createPneu,
  updatePneu,
  deletePneu,
  clearError as clearPneusError,
} from '../features/pneus/pneusSlice';

export {
  fetchFuelLogs,
  createFuelLog,
  updateFuelLog,
  deleteFuelLog,
  clearError as clearFuelLogsError,
} from '../features/fuelLogs/fuelLogsSlice';

export {
  fetchUsers,
  createUser,
  updateUser as updateUserAction,
  deleteUser,
  clearError as clearUsersError,
} from '../features/users/usersSlice';
