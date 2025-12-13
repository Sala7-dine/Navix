// Configuration de l'API
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    REFRESH: `${API_BASE_URL}/auth/refresh`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  
  // Users
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    CREATE: `${API_BASE_URL}/users/create`,
    GET_ALL: `${API_BASE_URL}/users`,
    GET_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/users/update/${id}`,
    DELETE: (id) => `${API_BASE_URL}/users/delete/${id}`,
    CHAUFFEURS: `${API_BASE_URL}/users/chauffeurs`,
  },
  
  // Camions
  CAMIONS: {
    BASE: `${API_BASE_URL}/camions`,
    CREATE: `${API_BASE_URL}/camions/create`,
    GET_ALL: `${API_BASE_URL}/camions`,
    GET_BY_ID: (id) => `${API_BASE_URL}/camions/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/camions/update/${id}`,
    DELETE: (id) => `${API_BASE_URL}/camions/delete/${id}`,
    DISPONIBLES: `${API_BASE_URL}/camions/disponibles`,
  },
  
  // Remorques
  REMORQUES: {
    BASE: `${API_BASE_URL}/remorques`,
    CREATE: `${API_BASE_URL}/remorques/create`,
    GET_ALL: `${API_BASE_URL}/remorques`,
    GET_BY_ID: (id) => `${API_BASE_URL}/remorques/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/remorques/update/${id}`,
    DELETE: (id) => `${API_BASE_URL}/remorques/delete/${id}`,
  },
  
  // Pneus
  PNEUS: {
    BASE: `${API_BASE_URL}/pneus`,
    CREATE: `${API_BASE_URL}/pneus`,
    GET_ALL: `${API_BASE_URL}/pneus`,
    GET_BY_ID: (id) => `${API_BASE_URL}/pneus/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/pneus/${id}`,
    DELETE: (id) => `${API_BASE_URL}/pneus/${id}`,
    BY_CAMION: (camionId) => `${API_BASE_URL}/pneus/camion/${camionId}`,
    CRITIQUES: `${API_BASE_URL}/pneus/critiques`,
    UPDATE_USURE: (id) => `${API_BASE_URL}/pneus/${id}/usure`,
  },
  
  // Trajets
  TRAJETS: {
    BASE: `${API_BASE_URL}/trajets`,
    CREATE: `${API_BASE_URL}/trajets/create`,
    GET_ALL: `${API_BASE_URL}/trajets`,
    GET_BY_ID: (id) => `${API_BASE_URL}/trajets/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/trajets/update/${id}`,
    DELETE: (id) => `${API_BASE_URL}/trajets/delete/${id}`,
    EN_COURS: `${API_BASE_URL}/trajets/en-cours`,
    BY_CHAUFFEUR: (chauffeurId) => `${API_BASE_URL}/trajets/chauffeur/${chauffeurId}`,
    MES_TRAJETS: `${API_BASE_URL}/trajets/chauffeur/mes-trajets`,
    UPDATE_STATUT: (id) => `${API_BASE_URL}/trajets/chauffeur/${id}/statut`,
    VALIDER: (id) => `${API_BASE_URL}/trajets/chauffeur/${id}/valider`,
    DOWNLOAD_PDF: (id) => `${API_BASE_URL}/trajets/chauffeur/${id}/pdf`,
  },
  
  // Maintenances
  MAINTENANCES: {
    BASE: `${API_BASE_URL}/maintenances`,
    CREATE: `${API_BASE_URL}/maintenances`,
    GET_ALL: `${API_BASE_URL}/maintenances`,
    GET_BY_ID: (id) => `${API_BASE_URL}/maintenances/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/maintenances/${id}`,
    DELETE: (id) => `${API_BASE_URL}/maintenances/${id}`,
    BY_CAMION: (camionId) => `${API_BASE_URL}/maintenances/camion/${camionId}`,
    PLANIFIEES: `${API_BASE_URL}/maintenances/planifiees`,
    DEMARRER: (id) => `${API_BASE_URL}/maintenances/${id}/demarrer`,
    TERMINER: (id) => `${API_BASE_URL}/maintenances/${id}/terminer`,
    STATS_TYPE: `${API_BASE_URL}/maintenances/stats/type`,
    COUT_CAMION: (camionId) => `${API_BASE_URL}/maintenances/camion/${camionId}/cout`,
  },
  
  // Fuel Logs
  FUEL_LOGS: {
    BASE: `${API_BASE_URL}/fuel-logs`,
    CREATE: `${API_BASE_URL}/fuel-logs`,
    GET_ALL: `${API_BASE_URL}/fuel-logs`,
    GET_BY_ID: (id) => `${API_BASE_URL}/fuel-logs/${id}`,
    UPDATE: (id) => `${API_BASE_URL}/fuel-logs/${id}`,
    DELETE: (id) => `${API_BASE_URL}/fuel-logs/${id}`,
    BY_TRAJET: (trajetId) => `${API_BASE_URL}/fuel-logs/trajet/${trajetId}`,
    TOTAL_BY_TRAJET: (trajetId) => `${API_BASE_URL}/fuel-logs/trajet/${trajetId}/total`,
    STATS_PERIODE: `${API_BASE_URL}/fuel-logs/stats/periode`,
    CONSOMMATION_CAMION: (camionId) => `${API_BASE_URL}/fuel-logs/camion/${camionId}/consommation`,
  },
};
