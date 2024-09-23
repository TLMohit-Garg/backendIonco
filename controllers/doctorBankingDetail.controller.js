import DoctorBankingDetail from "../models/doctorBankingDetail.model.js";
import mongoose from 'mongoose';
import { authenticateToken } from "../middleware/authMiddleware.js"

// Controller to create banking detail (bankingDetailRegistration)
export const bankingDetailRegistration = async (req, res) => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const bankingDetail = await DoctorBankingDetail.create({...req.body,  // Form data from the frontend
         userId});                                                          // Extracted from the JWT token
      res.status(200).json(bankingDetail);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Controller to get all banking details (getbankingDetails)
  export const getbankingDetails = async (req, res) => {
    try {
      const bankingDetails = await DoctorBankingDetail.find({});
      res.status(200).json(bankingDetails);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Controller to get a specific banking detail (getbankingDetail)
  export const getBankingDetailByUserId = async (req, res) => {
    try {
      const { userId } = req.params;
      const bankingDetail = await DoctorBankingDetail.findOne({ userId: userId });
      // console.log("Fetching banking detail for user ID:", userId);
  
      if (!bankingDetail) {
        return res.status(404).json({ message: "Banking detail not found" });
      }
      res.status(200).json(bankingDetail);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
   // Controller to get a specific banking detail (getbankingDetail)
   export const getbankingDetail = async (req, res) => {
    try {
      const { id } = req.params;
      const bankingDetail = await DoctorBankingDetail.findById(id);
  
      if (!bankingDetail) {
        return res.status(404).json({ message: "Banking detail not found" });
      }
      res.status(200).json(bankingDetail);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Controller to update a specific banking detail (updatebankingDetail)
  export const updatebankingDetail = async (req, res) => {
    try {
      const { id } = req.params;
      const bankingDetail = await DoctorBankingDetail.findByIdAndUpdate(id, req.body, { new: true });
  
      if (!bankingDetail) {
        return res.status(404).json({ message: "Banking detail not found" });
      }
      res.status(200).json(bankingDetail);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Controller to delete a specific banking detail (deletebankingDetail)
  export const deletebankingDetail = async (req, res) => {
    try {
      const { id } = req.params;
      const bankingDetail = await DoctorBankingDetail.findByIdAndDelete(id);
  
      if (!bankingDetail) {
        return res.status(404).json({ message: "Banking detail not found" });
      }
      res.status(200).json({ message: "Banking detail data is deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };



