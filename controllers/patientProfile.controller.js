import PatientProfile from "../models/patientProfile.model.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import Signup from "../models/signup.model.js"; // Reference to the signup/authentication model
import mongoose from "mongoose";

// Multer setup for parsing form-data
const upload = multer({ dest: "uploads/" });

// Controller to handle patient profile creation with optional image upload
export const createPatientProfile = async (req, res) => {
  const { userId, fullName, timezone } = req.body;

  // Ensure the userId is provided
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    // Validate if user exists
    const user = await Signup.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Handle optional image upload
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "patient_profiles", // Specify folder for images
      });
      imageUrl = result.secure_url; // Set the uploaded image URL
    }

    // Create a new patient profile in the database
    const newPatient = new PatientProfile({
      userId: user._id,
      fullName,
      timezone,
      imageUrl, // Include the uploaded image URL or null
    });

    await newPatient.save();
    res.status(201).send({
      message: "Patient profile created successfully",
      patient: newPatient,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error creating patient profile", error: error.message });
  }
};

// Controller to retrieve all patient profiles
export const getAllPatientProfiles = async (req, res) => {
  try {
    const patients = await PatientProfile.find().populate("userId");
    res
      .status(200)
      .send({ message: "Patient profiles retrieved successfully", patients });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        message: "Error fetching patient profiles",
        error: error.message,
      });
  }
};

// Controller to fetch a specific patient profile by userId
export const getPatientProfileById = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const patient = await PatientProfile.findOne({ userId }).populate("userId");
    if (!patient) {
      return res.status(404).send({ message: "Patient profile not found" });
    }
    res
      .status(200)
      .json({ message: "Patient profile retrieved successfully", patient });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching patient profile", error: error.message });
  }
};

// Controller to update patient profile
export const updatePatientProfileById = async (req, res) => {
  try {
    const { userId } = req.params;

    const patient = await PatientProfile.findOne({ userId });
    if (!patient) {
      return res.status(404).send({ message: "Patient profile not found" });
    }

    // Handle image update
    let imageUrl = patient.imageUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "patient_profiles",
      });
      imageUrl = result.secure_url;
    }

    const updatedFields = {
      ...req.body,
      imageUrl,
    };

    const updatedPatient = await PatientProfile.findOneAndUpdate(
      { userId },
      updatedFields,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).send({
      message: "Patient profile updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error updating patient profile",
      error: error.message,
    });
  }
};

// Controller to delete a patient profile
export const deletePatientProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    const patient = await PatientProfile.findOneAndDelete({ userId });

    if (!patient) {
      return res.status(404).send({ message: "Patient profile not found" });
    }

    res.status(200).send({ message: "Patient profile deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error deleting patient profile", error: error.message });
  }
};

// Multer middleware for file upload
export const multerMiddleware = upload.single("image");
