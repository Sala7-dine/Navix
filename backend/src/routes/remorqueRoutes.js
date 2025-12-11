import express from "express";

import { 
    CreateRemorque,
    GetAllRemorques,
    GetRemorqueById,
    UpdateRemorque,
    DeleteRemorque
} from "../contollers/remorqueController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";

const route = express.Router();

// Routes publiques (authentifiées)
route.get('/', authenticate, GetAllRemorques);
route.get('/:id', authenticate, GetRemorqueById);

// Routes protégées - Admin seulement
route.post('/create', authenticate, requireAdmin, CreateRemorque);
route.put('/update/:id', authenticate, requireAdmin, UpdateRemorque);
route.delete('/delete/:id', authenticate, requireAdmin, DeleteRemorque);

export default route;
