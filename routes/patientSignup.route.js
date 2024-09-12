import express from "express";
import {patientRegistration, getPatients, getPatient, updatePatient, deletePatient} from "../controllers/patientSignup.controller.js";

const router = express.Router();

router.post("/", patientRegistration);
router.get("/", getPatients);
router.get("/:id", getPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);


export default router;
