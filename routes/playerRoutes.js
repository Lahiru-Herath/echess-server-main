import express from 'express';
import { createPlayer, getPlayerByUser, getPlayersByTournamentAndPaymentStatus, getPlayerTournamentRegistrations, getPlayerTournaments, updatePaymentStatus, updatePlayer } from '../controllers/playerController.js';
import { authorizeRoles, verifyToken } from '../controllers/authControllers.js';

const router = express.Router();

router.get("/get-player-by-user/:id", verifyToken, authorizeRoles("PLAYER", "ORGANIZER"), getPlayerByUser);
router.get("/get-tournaments/:id", verifyToken, authorizeRoles("PLAYER"), getPlayerTournaments);
router.put("/:id", verifyToken, authorizeRoles("PLAYER"), updatePlayer);

router.post("/", createPlayer);
router.post("/update-payment-status", verifyToken, authorizeRoles("ORGANIZER"), updatePaymentStatus);
router.get("/players-by-payments", verifyToken, authorizeRoles("ORGANIZER"), getPlayersByTournamentAndPaymentStatus);
router.get("/get-player-tournament-registrations", verifyToken, authorizeRoles("PLAYER"), getPlayerTournamentRegistrations);

export default router;