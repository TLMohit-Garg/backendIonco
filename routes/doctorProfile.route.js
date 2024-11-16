import express from "express";
import {createDoctorProfile} from "../controllers/doctorProfile.controller.js";
import upload from "../middleware/upload.js";
// const upload = require('../middleware/upload'); // Multer upload middleware
const router = express.Router();

// Route to create doctor profile
router.post('/create-profile', upload.single('image'), createDoctorProfile);

export default router;

