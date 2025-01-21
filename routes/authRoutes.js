import express from 'express';
import { login, registerUser, requestPasswordReset, resetPassword } from '../controllers/authControllers.js';

const router = express.Router();

router.post("/reset-password/:token", resetPassword);

router.post("/register", registerUser);
router.post("/login", login);
router.post("/forgot-password", requestPasswordReset);

export default router;