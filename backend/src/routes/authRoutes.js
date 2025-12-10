import express from 'express';
import {
  register,
  login,
  refresh,
  logout,
} from '../contollers/authController.js';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);

router.post('/logout', logout);

export default router;
