import express from 'express';
import { createOrganizer, getOrganizer, getOrganizerByUser } from '../controllers/organizerController.js';
import { authorizeRoles, verifyToken } from '../controllers/authControllers.js';

const router = express.Router();

router.post("/", createOrganizer);

router.get("/:id", getOrganizer);

router.get("/getOrganizer/:id", verifyToken, authorizeRoles("ORGANIZER"), getOrganizerByUser);

export default router;