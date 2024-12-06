import express from "express";
import {
  createPatientProfile,
  getAllPatientProfiles,
  getPatientProfileById,
  updatePatientProfileById,
  multerMiddleware,
  deletePatientProfileById,
} from "../controllers/patientProfile.controller.js";
import upload from "../middleware/upload.js";
import { authenticateToken } from "../middleware/authenticateToken.js";

const router = express.Router();

// Route to create patient profile
router.post(
  '/createProfile',
  authenticateToken,
  upload.single('image'), // Handle image upload
  (req, res, next) => {
    console.log('Body:', req.body);
    console.log('File:', req.file); // To check if the file is being uploaded correctly
    next(); // Proceed to the next middleware/controller
  },
  createPatientProfile
);

// Route to get all patient profiles
router.get("/", getAllPatientProfiles);

// Route to get a specific patient profile by userId
router.get("/:userId", getPatientProfileById);

// Route to update a patient profile by userId
router.put(
  '/:userId',
  // Ensure the user is authenticated
  multerMiddleware, // Handle image updates
  updatePatientProfileById
);

// Route to delete a patient profile by userId
router.delete("/:userId", deletePatientProfileById);

export default router;
