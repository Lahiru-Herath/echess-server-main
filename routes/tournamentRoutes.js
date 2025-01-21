import express from 'express';
import { acceptPlayerRegistration, createTournament, getClassifiedTournaments, getTournament, getTournamentByStatus, getTournaments, playerRegistration, revokePlayerRegistration } from '../controllers/tournamentController.js';

const router = express.Router();

// STATIC ROUTES
router.get("/classified-tournaments", getClassifiedTournaments);
router.get("/tournament-by-status", getTournamentByStatus);
router.delete("/remove-player-registration", revokePlayerRegistration);
router.put("/accept-player-registration", acceptPlayerRegistration);

// DYNAMIC ROUTES
router.get("/:id", getTournament);
router.post("/:id/register", playerRegistration);

// OTHER ROUTES
router.post("/", createTournament);
router.get("/", getTournaments);


export default router;