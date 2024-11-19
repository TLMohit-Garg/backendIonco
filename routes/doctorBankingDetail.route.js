import express from "express";
import {
  bankingDetailRegistration,
  getbankingDetails,
  getbankingDetail,
  getBankingDetailByUserId,
  updatebankingDetail,
  deletebankingDetail,
} from "../controllers/doctorBankingDetail.controller.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, bankingDetailRegistration);
router.get("/", getbankingDetails);
router.get("/:id", getbankingDetail);
router.get("/user/:userId", getBankingDetailByUserId);
router.put("/:id", authenticateToken, updatebankingDetail);
router.delete("/:id", deletebankingDetail);

export default router;
