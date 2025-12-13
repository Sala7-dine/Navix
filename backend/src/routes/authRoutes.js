import express from 'express';
import {
  register,
  login,
  refresh,
  logout,
} from '../contollers/authController.js';
import { validate } from '../middlewares/validate.js';
import { loginSchema, registerSchema, refreshTokenSchema } from '../validations/auth.validation.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', validate(refreshTokenSchema), refresh);

router.post('/logout', logout);

export default router;
