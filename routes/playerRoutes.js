import express from 'express';
import { createPlayer, getPlayerByUser, getPlayerTournaments } from '../controllers/playerController.js';

const router = express.Router();

router.post("/", createPlayer);
router.get("/get-player-by-user/:id", getPlayerByUser);
router.get("/get-tournaments/:id", getPlayerTournaments)

export default router;