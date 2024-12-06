import express from "express";
import {bookConsultation, getConsultation, getconsultationId, getConsultationsByDoctorId, getConsultationsByPatientId} from "../controllers/consultation.controller.js";
import patientDocsUpload from "../middleware/patientDocsUpload.js";

const router = express.Router();

router.post('/createConsultation', patientDocsUpload.array('images', 10), 
(req, res, next) => {
    console.log('Body:', req.body);
    console.log('File:', req.file);  // To check if the file is being uploaded correctly
    next();  // Proceed to the next middleware/controller
  },bookConsultation);

router.get("/", getConsultation);
router.get("/:id",getconsultationId);
router.get("/getdoctorId/:doctorId",getConsultationsByDoctorId);
router.get("/getpatientId/:patientId", getConsultationsByPatientId);

// router.post("/", bookConsultation);

export default router;