import express from "express";

import { 
    CreateMaintenance,
    GetAllMaintenances,
    GetMaintenanceById,
    GetMaintenancesByCamion,
    UpdateMaintenance,
    DeleteMaintenance,
    GetMaintenancesPlanifiees,
    DemarrerMaintenance,
    TerminerMaintenance,
    GetStatsByType,
    GetCoutByCamion
} from "../contollers/maintenanceController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";

const route = express.Router();

// Routes publiques (authentifiées)
route.get('/planifiees', authenticate, GetMaintenancesPlanifiees);
route.get('/stats/type', authenticate, requireAdmin, GetStatsByType);
route.get('/camion/:camionId', authenticate, GetMaintenancesByCamion);
route.get('/camion/:camionId/cout', authenticate, requireAdmin, GetCoutByCamion);
route.get('/', authenticate, GetAllMaintenances);
route.get('/:id', authenticate, GetMaintenanceById);

// Routes protégées - Admin seulement
route.post('/', authenticate, requireAdmin, CreateMaintenance);
route.put('/:id', authenticate, requireAdmin, UpdateMaintenance);
route.delete('/:id', authenticate, requireAdmin, DeleteMaintenance);

// Actions spéciales
route.patch('/:id/demarrer', authenticate, requireAdmin, DemarrerMaintenance);
route.patch('/:id/terminer', authenticate, requireAdmin, TerminerMaintenance);

export default route;
