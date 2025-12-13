/**
 * Index centralisé de toutes les validations Yup
 * Permet d'importer toutes les validations depuis un seul fichier
 */

// Auth validations
export {
  loginSchema,
  registerSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} from './auth.validation.js';

// User validations
export {
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
} from './user.validation.js';

// Camion validations
export {
  createCamionSchema,
  updateCamionSchema,
} from './camion.validation.js';

// Remorque validations
export {
  createRemorqueSchema,
  updateRemorqueSchema,
} from './remorque.validation.js';

// Pneu validations
export {
  createPneuSchema,
  updatePneuSchema,
} from './pneu.validation.js';

// Trajet validations
export {
  createTrajetSchema,
  updateTrajetSchema,
  updateStatutTrajetSchema,
  validerFinTrajetSchema,
} from './trajet.validation.js';

// Maintenance validations
export {
  createMaintenanceSchema,
  updateMaintenanceSchema,
} from './maintenance.validation.js';

// FuelLog validations
export {
  createFuelLogSchema,
  updateFuelLogSchema,
} from './fuelLog.validation.js';
