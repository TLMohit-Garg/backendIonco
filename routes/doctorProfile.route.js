import express from "express";
import {createDoctorProfile, getAllDoctorProfiles, getDoctorProfileById, updateDoctorProfileById,multerMiddleware, deleteDoctorProfileById} from "../controllers/doctorProfile.controller.js";
import upload from "../middleware/upload.js";
import {authenticateToken} from "../middleware/authenticateToken.js";

const router = express.Router();

// Route to create doctor profile
router.post('/createProfile', authenticateToken, upload.single('image'), 
(req, res, next) => {
    console.log('Body:', req.body);
    console.log('File:', req.file);  // To check if the file is being uploaded correctly
    next();  // Proceed to the next middleware/controller
  },createDoctorProfile);

router.get("/", getAllDoctorProfiles);
router.get("/:userId", getDoctorProfileById);
router.put(
  '/:userId',
  authenticateToken, // Ensure the user is authenticated
  multerMiddleware,
  updateDoctorProfileById
);
router.delete("/:userId",authenticateToken, deleteDoctorProfileById);  

export default router;

