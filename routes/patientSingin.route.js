import express from "express";
import {patientSignin, getPatients, getPatient, updatePatient, deletePatient} from "../controllers/patientSignin.controller.js";

const router = express.Router();

router.post("/", patientSignin);
router.get("/", getPatients);
router.get("/:id", getPatient);
router.put("/:id", updatePatient);
router.delete("/:id", deletePatient);

export default router;


