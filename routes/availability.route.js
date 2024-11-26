import express from "express";
import { addAvailability, fetchAvailability, fetchAvailabilityByDoctorId } from "../controllers/availability.controller.js";

const router = express.Router();

// Endpoint for storing availability
router.post("/", addAvailability);

// Endpoint for fetching availability
router.get("/", fetchAvailability);

// Route for fetching availability by doctorId
router.get("/:doctorId", fetchAvailabilityByDoctorId);

export default router;
