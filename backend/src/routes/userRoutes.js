import express from "express";

import { 
    CreateUser, 
    GetAllUsers, 
    GetUserById, 
    UpdateUser, 
    DeleteUser,
    GetChauffeurs
} from "../contollers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireAdmin } from "../middlewares/roleMiddleware.js";
import { validate } from "../middlewares/validate.js";
import { createUserSchema, updateUserSchema } from "../validations/user.validation.js";

const route = express.Router();

// Routes protégées - Admin seulement
route.post('/create', authenticate, requireAdmin, validate(createUserSchema), CreateUser);
route.get('/', authenticate, requireAdmin, GetAllUsers);
route.get('/chauffeurs', authenticate, GetChauffeurs);
route.get('/:id', authenticate, GetUserById);
route.put('/update/:id', authenticate, requireAdmin, validate(updateUserSchema), UpdateUser);
route.delete('/delete/:id', authenticate, requireAdmin, DeleteUser);

export default route; 