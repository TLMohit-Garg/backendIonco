// routes/imageRouter.js
import express from 'express';
import { uploadImage } from '../controllers/image.controller.js';

const router = express.Router();

// Image upload route
router.post('/upload', uploadImage);

export default router;
