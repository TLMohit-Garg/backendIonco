import express from "express";
import {patientRegistration} from "../controllers/patientSignup.controller.js";

const router = express.Router();

router.post("/", patientRegistration);


export default router;
