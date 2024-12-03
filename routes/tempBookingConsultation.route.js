import express from 'express';
import { getTempConsultationBookingSession, createTempConsultation } from '../controllers/tempBookingConsultation.controller.js';

const router = express.Router();

// Route for retrieving an existing Stripe Checkout session
router.get('/stripe/session/:sessionId', getTempConsultationBookingSession);

// For posting the temporary data
router.post("/createTempConsultation", createTempConsultation);

export default router;