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
import { validate } from "../middlewares/validate.js";
import { createRemorqueSchema, updateRemorqueSchema } from "../validations/remorque.validation.js";

const route = express.Router();

// Routes publiques (authentifiées)
route.get('/', authenticate, GetAllRemorques);
route.get('/:id', authenticate, GetRemorqueById);

// Routes protégées - Admin seulement
route.post('/create', authenticate, requireAdmin, validate(createRemorqueSchema), CreateRemorque);
route.put('/update/:id', authenticate, requireAdmin, validate(updateRemorqueSchema), UpdateRemorque);
route.delete('/delete/:id', authenticate, requireAdmin, DeleteRemorque);

export default route;
