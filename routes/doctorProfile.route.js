import express from "express";
import {createDoctorProfile} from "../controllers/doctorProfile.controller.js";
import upload from "../middleware/upload.js";
// const upload = require('../middleware/upload'); // Multer upload middleware
const router = express.Router();

// Route to create doctor profile
router.post('/createProfile', upload.single('image'), 
(req, res, next) => {
    console.log('Body:', req.body);
    console.log('File:', req.file);  // To check if the file is being uploaded correctly
    next();  // Proceed to the next middleware/controller
  },createDoctorProfile);

export default router;

