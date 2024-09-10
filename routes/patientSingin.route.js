import express from "express";
import {patientSignin} from "../controllers/patientSignin.controller.js";

const router = express.Router();

router.post("/", patientSignin);

export default router;


