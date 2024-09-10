import express from "express";
import {doctorSignin} from "../controllers/doctorSignin.controller.js";

const router = express.Router();

router.post("/", doctorSignin);

export default router;