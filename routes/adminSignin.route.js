import express from "express";
import { userSignin } from "../controllers/adminSignin.controller.js";

const router  = express.Router();

// POST route for user login
router.post('/', userSignin);

export default router;
