import express from "express";
import {doctorRegistration, getdoctors} from "../controllers/doctorSignup.controller.js";

const router = express.Router();

router.get("/", getdoctors);
router.post("/", doctorRegistration);


export default router;
