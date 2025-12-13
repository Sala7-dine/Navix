import express from "express";

import { 
    CreatePneu,
    GetAllPneus,
    GetPneuById,
    GetPneusByCamion,
    UpdatePneu,
    DeletePneu,
    GetPneusCritiques,
    UpdateUsurePneu
} from "../contollers/pneuController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { createPneuSchema, updatePneuSchema } from "../validations/pneu.validation.js";

const route = express.Router();

// Routes publiques (authentifiées)
route.get('/critiques', authenticate, GetPneusCritiques);
route.get('/camion/:camionId', authenticate, GetPneusByCamion);
route.get('/', authenticate, GetAllPneus);
route.get('/:id', authenticate, GetPneuById);

// Routes protégées - Admin seulement
route.post('/', authenticate, requireAdmin, validate(createPneuSchema), CreatePneu);
route.put('/:id', authenticate, requireAdmin, validate(updatePneuSchema), UpdatePneu);
route.patch('/:id/usure', authenticate, requireAdmin, UpdateUsurePneu);
route.delete('/:id', authenticate, requireAdmin, DeletePneu);

export default route;
