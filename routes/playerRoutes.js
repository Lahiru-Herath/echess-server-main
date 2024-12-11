import express from 'express';
import { createPlayer } from '../controllers/playerController.js';

const router = express.Router();

router.post("/", createPlayer);

export default router;