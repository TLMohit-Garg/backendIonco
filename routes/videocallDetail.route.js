import express from 'express';
import { generateVideoCallLink, getConsultationById } from '../controllers/videoCalldetails.controller.js';

const router = express.Router();

// Route to generate video call link
router.post('/generateVideoCallLink', generateVideoCallLink);

// Route to get consultation details by ID
router.get('/:id', getConsultationById);

export default router;
