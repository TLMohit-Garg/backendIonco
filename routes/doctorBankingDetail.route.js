import express from "express";
import {bankingDetailRegistration, getbankingDetails, getbankingDetail, updatebankingDetail, deletebankingDetail} from "../controllers/doctorBankingDetail.controller.js";

const router = express.Router();

router.post("/", bankingDetailRegistration);
router.get("/", getbankingDetails);
router.get("/:id", getbankingDetail);
router.put("/:id", updatebankingDetail);
router.delete("/:id", deletebankingDetail);


export default router;
