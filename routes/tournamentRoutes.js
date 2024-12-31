import express from 'express';
import { createTournament, getClassifiedTournaments, getTournaments } from '../controllers/tournamentController.js';

const router = express.Router();

router.post("/", createTournament);

router.get("/", getTournaments);

router.get("/classified-tournaments", getClassifiedTournaments);

export default router;