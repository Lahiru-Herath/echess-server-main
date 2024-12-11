import express from 'express';
import { deleteUser, getUser } from '../controllers/userController.js';

const router = express.Router();

// GET USER BY ID
router.get("/:id", getUser);

// DELETE USER BY ID
router.delete("/:id", deleteUser)

export default router;