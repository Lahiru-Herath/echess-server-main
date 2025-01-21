import express from 'express';
import { createPlayer, getPlayerByUser, getPlayersByTournamentAndPaymentStatus, getPlayerTournamentRegistrations, getPlayerTournaments, updatePaymentStatus } from '../controllers/playerController.js';

const router = express.Router();

router.get("/get-player-by-user/:id", getPlayerByUser);
router.get("/get-tournaments/:id", getPlayerTournaments);

router.post("/", createPlayer);
router.post("/update-payment-status", updatePaymentStatus);
router.get("/players-by-payments", getPlayersByTournamentAndPaymentStatus);
router.get("/get-player-tournament-registrations", getPlayerTournamentRegistrations);

export default router;