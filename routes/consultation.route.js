import express from "express";
import {bookConsultation, getConsultation, getconsultationId} from "../controllers/consultation.controller.js";
import multer from "multer";

const router = express.Router();

// Set up multer for file uploads
// const upload = multer({ dest: "uploads/" });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now()
      cb(null,uniqueSuffix + file.originalname);
    }
  })
  
  const upload = multer({ storage: storage })

router.post("/", upload.array("images", 10), bookConsultation);
router.get("/", getConsultation);
router.get("/:id",getconsultationId);

// router.post("/", bookConsultation);

export default router;