import express from 'express';
import { getTempConsultationBookingSession, createTempConsultation, getConsultationsByDoctorId, getConsultations } from '../controllers/tempBookingConsultation.controller.js';
import patientDocsUpload from "../middleware/patientDocsUpload.js";

const router = express.Router();

// Route for retrieving an existing Stripe Checkout session
router.get('/stripe/session/:sessionId', getTempConsultationBookingSession);

// For posting the temporary data
// router.post("/createTempConsultation", createTempConsultation);
router.post('/createTempConsultation', patientDocsUpload.array('images', 10), 
(req, res, next) => {
    console.log('Body:', req.body);
    console.log('File:', req.file);  // To check if the file is being uploaded correctly
    next();  // Proceed to the next middleware/controller
  },createTempConsultation);
router.get("/getdoctorId/:doctorId",getConsultationsByDoctorId);
router.get("/",getConsultations);


export default router;



