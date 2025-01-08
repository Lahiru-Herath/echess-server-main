import express from 'express';
import { createPlayer, getPlayerByUser, getPlayerTournaments, updatePaymentStatus } from '../controllers/playerController.js';

const router = express.Router();

router.get("/get-player-by-user/:id", getPlayerByUser);
router.get("/get-tournaments/:id", getPlayerTournaments);

router.post("/", createPlayer);
router.post("/update-payment-status", updatePaymentStatus);

export default router;