import express from 'express';
import { generateVideoCallLink, saveConsultationNotes, updateNotes, getConsultationsByUser } from '../controllers/videoCalldetails.controller.js';

const router = express.Router();

// Route to generate video call link
router.post('/generateVideoCallLink', generateVideoCallLink);

// Route to get consultation details by ID
// router.get('/:id', getConsultationById);

// Route for savings consultation notes
router.post('/saveConsultationNotes', saveConsultationNotes);

// Route for update consultation notes
router.put('/:consultationId',updateNotes); 
router.get('/:userId', getConsultationsByUser);

export default router;
