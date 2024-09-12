import express from "express";
import {doctorSignin, getDoctors, getDoctor, updateDoctor, deleteDoctor} from "../controllers/doctorSignin.controller.js";

const router = express.Router();

router.post("/", doctorSignin);
router.get("/", getDoctors);
router.get("/:id", getDoctor);
router.put("/:id", updateDoctor);
router.delete("/:id", deleteDoctor);

export default router;