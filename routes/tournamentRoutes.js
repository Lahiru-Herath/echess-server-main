import express from 'express';
import { createTournament, getClassifiedTournaments, getTournament, getTournamentByStatus, getTournaments, playerRegistration } from '../controllers/tournamentController.js';

const router = express.Router();

// STATIC ROUTES
router.get("/classified-tournaments", getClassifiedTournaments);
router.get("/tournament-by-status", getTournamentByStatus);

// DYNAMIC ROUTES
router.get("/:id", getTournament);
router.post("/:id/register", playerRegistration);

// OTHER ROUTES
router.post("/", createTournament);
router.get("/", getTournaments);


export default router;