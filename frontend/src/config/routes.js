// Routes de l'application
export const ROUTES = {
  // Public
  LOGIN: '/login',
  REGISTER: '/register',
  
  // Dashboard
  DASHBOARD: '/',
  ADMIN_DASHBOARD: '/admin/dashboard',
  CHAUFFEUR_DASHBOARD: '/chauffeur/dashboard',
  
  // Camions
  CAMIONS: '/camions',
  CAMIONS_LIST: '/camions/list',
  CAMION_DETAIL: '/camions/:id',
  CAMION_CREATE: '/camions/create',
  CAMION_EDIT: '/camions/:id/edit',
  
  // Remorques
  REMORQUES: '/remorques',
  REMORQUES_LIST: '/remorques/list',
  REMORQUE_DETAIL: '/remorques/:id',
  REMORQUE_CREATE: '/remorques/create',
  REMORQUE_EDIT: '/remorques/:id/edit',
  
  // Pneus
  PNEUS: '/pneus',
  PNEUS_LIST: '/pneus/list',
  PNEU_DETAIL: '/pneus/:id',
  PNEU_CREATE: '/pneus/create',
  PNEU_EDIT: '/pneus/:id/edit',
  
  // Trajets
  TRAJETS: '/trajets',
  TRAJETS_LIST: '/trajets/list',
  TRAJET_DETAIL: '/trajets/:id',
  TRAJET_CREATE: '/trajets/create',
  TRAJET_EDIT: '/trajets/:id/edit',
  MES_TRAJETS: '/mes-trajets',
  
  // Maintenances
  MAINTENANCES: '/maintenances',
  MAINTENANCES_LIST: '/maintenances/list',
  MAINTENANCE_DETAIL: '/maintenances/:id',
  MAINTENANCE_CREATE: '/maintenances/create',
  MAINTENANCE_EDIT: '/maintenances/:id/edit',
  
  // Fuel Logs
  FUEL_LOGS: '/fuel-logs',
  FUEL_LOGS_LIST: '/fuel-logs/list',
  FUEL_LOG_CREATE: '/fuel-logs/create',
  
  // Users
  USERS: '/users',
  USERS_LIST: '/users/list',
  USER_DETAIL: '/users/:id',
  USER_CREATE: '/users/create',
  USER_EDIT: '/users/:id/edit',
  PROFILE: '/profile',
  
  // Reports
  REPORTS: '/reports',
  REPORTS_MAINTENANCES: '/reports/maintenances',
  REPORTS_TRAJETS: '/reports/trajets',
  REPORTS_FUEL: '/reports/fuel',
  
  // Settings
  SETTINGS: '/settings',
  
  // Error pages
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
  SERVER_ERROR: '/500',
};

// Helper functions pour générer des routes avec params
export const generatePath = (path, params = {}) => {
  let generatedPath = path;
  Object.keys(params).forEach((key) => {
    generatedPath = generatedPath.replace(`:${key}`, params[key]);
  });
  return generatedPath;
};

// Examples:
// generatePath(ROUTES.CAMION_DETAIL, { id: '123' }) => '/camions/123'
// generatePath(ROUTES.TRAJET_EDIT, { id: '456' }) => '/trajets/456/edit'

export default ROUTES;
