import express from 'express';
import { createOrganizer, getOrganizer, getOrganizerByUser } from '../controllers/organizerController.js';

const router = express.Router();

router.post("/", createOrganizer);

router.get("/:id", getOrganizer);

router.get("/getOrganizer/:id", getOrganizerByUser);

export default router;