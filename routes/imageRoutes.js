import express from 'express';
import multer from 'multer';
import { uploadProfilePicture } from '../controllers/imageControllers.js';


const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/profile-picture', upload.single('profilePicture'), uploadProfilePicture);

export default router;