import express from 'express';
import { deleteUser, getUser, updateUser } from '../controllers/userController.js';

const router = express.Router();

// GET USER BY ID
router.get("/:id", getUser);

// UPDATE USER BY ID
router.put("/:id", updateUser);

// DELETE USER BY ID
router.delete("/:id", deleteUser)

export default router;