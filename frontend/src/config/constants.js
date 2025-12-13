// Configuration des constantes de l'application
export const APP_CONFIG = {
  NAME: 'Navix',
  VERSION: '1.0.0',
  DESCRIPTION: 'Système de gestion de flotte de transport',
};

// Rôles utilisateurs
export const USER_ROLES = {
  ADMIN: 'admin',
  CHAUFFEUR: 'chauffeur',
};

// Statuts des camions
export const CAMION_STATUS = {
  DISPONIBLE: 'DISPONIBLE',
  EN_MISSION: 'EN_MISSION',
  EN_TRAJET: 'EN_TRAJET',
  MAINTENANCE: 'MAINTENANCE',
};

// Statuts des remorques
export const REMORQUE_STATUS = {
  DISPONIBLE: 'DISPONIBLE',
  EN_MISSION: 'EN_MISSION',
  EN_TRAJET: 'EN_TRAJET',
};

// Types de remorques
export const REMORQUE_TYPES = {
  FRIGORIFIQUE: 'FRIGORIFIQUE',
  BENNE: 'BENNE',
  PLATEAU: 'PLATEAU',
  CITERNE: 'CITERNE',
  PORTE_CONTENEUR: 'PORTE_CONTENEUR',
};

// Statuts des trajets
export const TRAJET_STATUS = {
  PLANIFIE: 'PLANIFIE',
  EN_COURS: 'EN_COURS',
  TERMINE: 'TERMINE',
  ANNULE: 'ANNULE',
};

// Types de maintenance
export const MAINTENANCE_TYPES = {
  VIDANGE: 'VIDANGE',
  REVISION: 'REVISION',
  PNEU: 'PNEU',
  FREIN: 'FREIN',
  TRANSMISSION: 'TRANSMISSION',
  SUSPENSION: 'SUSPENSION',
  CLIMATISATION: 'CLIMATISATION',
  ELECTRICITE: 'ELECTRICITE',
  CARROSSERIE: 'CARROSSERIE',
  AUTRE: 'AUTRE',
};

// Statuts de maintenance
export const MAINTENANCE_STATUS = {
  PLANIFIEE: 'PLANIFIEE',
  EN_COURS: 'EN_COURS',
  TERMINEE: 'TERMINEE',
  ANNULEE: 'ANNULEE',
};

// Positions des pneus
export const PNEU_POSITIONS = {
  AVANT_GAUCHE: 'AVANT_GAUCHE',
  AVANT_DROIT: 'AVANT_DROIT',
  ARRIERE_GAUCHE: 'ARRIERE_GAUCHE',
  ARRIERE_DROIT: 'ARRIERE_DROIT',
  ARRIERE_GAUCHE_EXTERIEUR: 'ARRIERE_GAUCHE_EXTERIEUR',
  ARRIERE_DROIT_EXTERIEUR: 'ARRIERE_DROIT_EXTERIEUR',
};

// Couleurs pour les statuts
export const STATUS_COLORS = {
  // Camions
  DISPONIBLE: '#10b981', // green
  EN_MISSION: '#f59e0b', // amber
  EN_TRAJET: '#3b82f6', // blue
  MAINTENANCE: '#ef4444', // red
  
  // Trajets
  PLANIFIE: '#8b5cf6', // violet
  EN_COURS: '#3b82f6', // blue
  TERMINE: '#10b981', // green
  ANNULE: '#6b7280', // gray
  
  // Maintenances
  PLANIFIEE: '#8b5cf6', // violet
  TERMINEE: '#10b981', // green
  ANNULEE: '#6b7280', // gray
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  LIMITS: [10, 20, 50, 100],
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'navix_auth_token',
  REFRESH_TOKEN: 'navix_refresh_token',
  USER_DATA: 'navix_user_data',
  THEME: 'navix_theme',
};

// Messages
export const MESSAGES = {
  SUCCESS: {
    CREATE: 'Créé avec succès',
    UPDATE: 'Mis à jour avec succès',
    DELETE: 'Supprimé avec succès',
    LOGIN: 'Connexion réussie',
    LOGOUT: 'Déconnexion réussie',
  },
  ERROR: {
    GENERIC: 'Une erreur est survenue',
    NETWORK: 'Erreur de connexion au serveur',
    UNAUTHORIZED: 'Vous devez être connecté',
    FORBIDDEN: 'Accès interdit',
    NOT_FOUND: 'Ressource introuvable',
    VALIDATION: 'Données invalides',
  },
};

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DD HH:mm:ss',
};

export default {
  APP_CONFIG,
  USER_ROLES,
  CAMION_STATUS,
  REMORQUE_STATUS,
  REMORQUE_TYPES,
  TRAJET_STATUS,
  MAINTENANCE_TYPES,
  MAINTENANCE_STATUS,
  PNEU_POSITIONS,
  STATUS_COLORS,
  PAGINATION,
  STORAGE_KEYS,
  MESSAGES,
  DATE_FORMATS,
};
