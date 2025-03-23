import express from 'express';
import { createOrganizer, getOrganizer, getOrganizerByUser, updateOrganizer } from '../controllers/organizerController.js';
import { authorizeRoles, verifyToken } from '../controllers/authControllers.js';

const router = express.Router();

router.post("/", createOrganizer);

router.get("/:id", getOrganizer);

router.put("/:id", verifyToken, authorizeRoles("ORGANIZER"), updateOrganizer);

router.get("/getOrganizer/:id", verifyToken, authorizeRoles("ORGANIZER"), getOrganizerByUser);

export default router;