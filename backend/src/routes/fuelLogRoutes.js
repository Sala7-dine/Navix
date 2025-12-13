import express from "express";

import { 
    CreateFuelLog,
    GetAllFuelLogs,
    GetFuelLogById,
    GetFuelLogsByTrajet,
    UpdateFuelLog,
    DeleteFuelLog,
    GetTotalByTrajet,
    GetStatsByPeriode,
    GetConsommationMoyenneByCamion
} from "../contollers/fuelLogController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { createFuelLogSchema, updateFuelLogSchema } from "../validations/fuelLog.validation.js";

const route = express.Router();

// Routes publiques (authentifiées)
route.get('/stats/periode', authenticate, requireAdmin, GetStatsByPeriode);
route.get('/trajet/:trajetId', authenticate, GetFuelLogsByTrajet);
route.get('/trajet/:trajetId/total', authenticate, GetTotalByTrajet);
route.get('/camion/:camionId/consommation', authenticate, GetConsommationMoyenneByCamion);
route.get('/', authenticate, GetAllFuelLogs);
route.get('/:id', authenticate, GetFuelLogById);

// Routes protégées - Admin et Chauffeur
route.post('/', authenticate, validate(createFuelLogSchema), CreateFuelLog);
route.put('/:id', authenticate, requireAdmin, validate(updateFuelLogSchema), UpdateFuelLog);
route.delete('/:id', authenticate, requireAdmin, DeleteFuelLog);

export default route;
