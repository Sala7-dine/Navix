import express from "express";
import { 
    CreateCamion, 
    GetCamion, 
    GetAllCamions, 
    DeleteCamion, 
    UpdateCamion,
    GetCamionsDisponibles 
} from "../contollers/camionController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { createCamionSchema, updateCamionSchema } from "../validations/camion.validation.js";

const route = express.Router();

// Routes publiques (authentifiées)
route.get('/disponibles', authenticate, GetCamionsDisponibles);
route.get('/', authenticate, GetAllCamions);
route.get('/:id', authenticate, GetCamion);

// Routes protégées - Admin seulement
route.post('/create', authenticate, requireAdmin, validate(createCamionSchema), CreateCamion);
route.put('/update/:id', authenticate, requireAdmin, validate(updateCamionSchema), UpdateCamion);
route.delete('/delete/:id', authenticate, requireAdmin, DeleteCamion);

export default route;
