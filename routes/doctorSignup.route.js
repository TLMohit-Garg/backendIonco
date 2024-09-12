import express from "express";
import {doctorRegistration, getDoctors, getDoctor, updateDoctor, deleteDoctor} from "../controllers/doctorSignup.controller.js";

const router = express.Router();

router.get("/", getDoctors);
router.post("/", doctorRegistration);
router.get("/:id", getDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);


export default router;
