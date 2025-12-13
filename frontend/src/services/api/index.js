import apiClient from './apiClient';
import { API_ENDPOINTS } from '../../config/api';

// ============================================
// AUTH SERVICE
// ============================================
export const authService = {
  login: async (credentials) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response.data;
  },

  register: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  refresh: async (refreshToken) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });
    return response.data;
  },
};

// ============================================
// USERS SERVICE
// ============================================
export const usersService = {
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.GET_ALL);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.GET_BY_ID(id));
    return response.data;
  },

  create: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.USERS.CREATE, userData);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE(id), userData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
    return response.data;
  },

  getChauffeurs: async () => {
    const response = await apiClient.get(API_ENDPOINTS.USERS.CHAUFFEURS);
    return response.data;
  },
};

// ============================================
// CAMIONS SERVICE
// ============================================
export const camionsService = {
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.CAMIONS.GET_ALL);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.CAMIONS.GET_BY_ID(id));
    return response.data;
  },

  create: async (camionData) => {
    const response = await apiClient.post(API_ENDPOINTS.CAMIONS.CREATE, camionData);
    return response.data;
  },

  update: async (id, camionData) => {
    const response = await apiClient.put(API_ENDPOINTS.CAMIONS.UPDATE(id), camionData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.CAMIONS.DELETE(id));
    return response.data;
  },

  getDisponibles: async () => {
    const response = await apiClient.get(API_ENDPOINTS.CAMIONS.DISPONIBLES);
    return response.data;
  },
};

// ============================================
// REMORQUES SERVICE
// ============================================
export const remorquesService = {
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.REMORQUES.GET_ALL);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.REMORQUES.GET_BY_ID(id));
    return response.data;
  },

  create: async (remorqueData) => {
    const response = await apiClient.post(API_ENDPOINTS.REMORQUES.CREATE, remorqueData);
    return response.data;
  },

  update: async (id, remorqueData) => {
    const response = await apiClient.put(API_ENDPOINTS.REMORQUES.UPDATE(id), remorqueData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.REMORQUES.DELETE(id));
    return response.data;
  },
};

// ============================================
// TRAJETS SERVICE
// ============================================
export const trajetsService = {
  getAll: async (filters = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.TRAJETS.GET_ALL, { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.TRAJETS.GET_BY_ID(id));
    return response.data;
  },

  create: async (trajetData) => {
    const response = await apiClient.post(API_ENDPOINTS.TRAJETS.CREATE, trajetData);
    return response.data;
  },

  update: async (id, trajetData) => {
    const response = await apiClient.put(API_ENDPOINTS.TRAJETS.UPDATE(id), trajetData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.TRAJETS.DELETE(id));
    return response.data;
  },

  getEnCours: async () => {
    const response = await apiClient.get(API_ENDPOINTS.TRAJETS.EN_COURS);
    return response.data;
  },

  getMesTrajets: async () => {
    const response = await apiClient.get(API_ENDPOINTS.TRAJETS.MES_TRAJETS);
    return response.data;
  },

  updateStatut: async (id, data) => {
    const response = await apiClient.put(API_ENDPOINTS.TRAJETS.UPDATE_STATUT(id), data);
    return response.data;
  },

  valider: async (id, data) => {
    const response = await apiClient.post(API_ENDPOINTS.TRAJETS.VALIDER(id), data);
    return response.data;
  },

  downloadPDF: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.TRAJETS.DOWNLOAD_PDF(id), {
      responseType: 'blob',
    });
    return response.data;
  },
};

// ============================================
// MAINTENANCES SERVICE
// ============================================
export const maintenancesService = {
  getAll: async (filters = {}) => {
    const response = await apiClient.get(API_ENDPOINTS.MAINTENANCES.GET_ALL, { params: filters });
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.MAINTENANCES.GET_BY_ID(id));
    return response.data;
  },

  create: async (maintenanceData) => {
    const response = await apiClient.post(API_ENDPOINTS.MAINTENANCES.CREATE, maintenanceData);
    return response.data;
  },

  update: async (id, maintenanceData) => {
    const response = await apiClient.put(API_ENDPOINTS.MAINTENANCES.UPDATE(id), maintenanceData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.MAINTENANCES.DELETE(id));
    return response.data;
  },

  getByCamion: async (camionId) => {
    const response = await apiClient.get(API_ENDPOINTS.MAINTENANCES.BY_CAMION(camionId));
    return response.data;
  },

  getPlanifiees: async () => {
    const response = await apiClient.get(API_ENDPOINTS.MAINTENANCES.PLANIFIEES);
    return response.data;
  },

  demarrer: async (id) => {
    const response = await apiClient.patch(API_ENDPOINTS.MAINTENANCES.DEMARRER(id));
    return response.data;
  },

  terminer: async (id) => {
    const response = await apiClient.patch(API_ENDPOINTS.MAINTENANCES.TERMINER(id));
    return response.data;
  },

  getStatsByType: async (dateDebut, dateFin) => {
    const response = await apiClient.get(API_ENDPOINTS.MAINTENANCES.STATS_TYPE, {
      params: { dateDebut, dateFin },
    });
    return response.data;
  },
};

// ============================================
// FUEL LOGS SERVICE
// ============================================
export const fuelLogsService = {
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.FUEL_LOGS.GET_ALL);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.FUEL_LOGS.GET_BY_ID(id));
    return response.data;
  },

  create: async (fuelLogData) => {
    const response = await apiClient.post(API_ENDPOINTS.FUEL_LOGS.CREATE, fuelLogData);
    return response.data;
  },

  update: async (id, fuelLogData) => {
    const response = await apiClient.put(API_ENDPOINTS.FUEL_LOGS.UPDATE(id), fuelLogData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.FUEL_LOGS.DELETE(id));
    return response.data;
  },

  getByTrajet: async (trajetId) => {
    const response = await apiClient.get(API_ENDPOINTS.FUEL_LOGS.BY_TRAJET(trajetId));
    return response.data;
  },

  getStatsPeriode: async (dateDebut, dateFin) => {
    const response = await apiClient.get(API_ENDPOINTS.FUEL_LOGS.STATS_PERIODE, {
      params: { dateDebut, dateFin },
    });
    return response.data;
  },
};

// ============================================
// PNEUS SERVICE
// ============================================
export const pneusService = {
  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PNEUS.GET_ALL);
    return response.data;
  },

  getById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.PNEUS.GET_BY_ID(id));
    return response.data;
  },

  create: async (pneuData) => {
    const response = await apiClient.post(API_ENDPOINTS.PNEUS.CREATE, pneuData);
    return response.data;
  },

  update: async (id, pneuData) => {
    const response = await apiClient.put(API_ENDPOINTS.PNEUS.UPDATE(id), pneuData);
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.PNEUS.DELETE(id));
    return response.data;
  },

  getByCamion: async (camionId) => {
    const response = await apiClient.get(API_ENDPOINTS.PNEUS.BY_CAMION(camionId));
    return response.data;
  },

  getCritiques: async () => {
    const response = await apiClient.get(API_ENDPOINTS.PNEUS.CRITIQUES);
    return response.data;
  },

  updateUsure: async (id, usure) => {
    const response = await apiClient.patch(API_ENDPOINTS.PNEUS.UPDATE_USURE(id), { usure });
    return response.data;
  },
};

// Export all services
export default {
  auth: authService,
  users: usersService,
  camions: camionsService,
  remorques: remorquesService,
  trajets: trajetsService,
  maintenances: maintenancesService,
  fuelLogs: fuelLogsService,
  pneus: pneusService,
};
