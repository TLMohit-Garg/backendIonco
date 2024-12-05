import DoctorProfile from "../models/doctorProfile.model.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import DoctorSignup from "../models/doctorsignup.model.js";
import mongoose from "mongoose";


// Multer setup for parsing form-data
const upload = multer({ dest: "uploads/" });

// Controller to handle doctor profile creation with image upload
export const createDoctorProfile = async (req, res) => {
  const {
    userId,
    title,
    speciality,
    description,
    exploredescription,
    charges,
    country,
    qualification,
    workExperience,
    preferredCurrency,
  } = req.body;
  console.log("req.file is :-", req.file);

  // Ensure the image file is uploaded
  if (!req.file) {
    return res.status(400).send({ message: "No image file uploaded" });
  }
  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }
  try {
    // Validate if user exists
    const user = await DoctorSignup.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "doctor_profiles", // Specify the folder for images
    });
    console.log("result of path", result);
    // Create a new doctor profile in the database
    const newDoctor = new DoctorProfile({
      userId: user._id,
      title,
      speciality,
      description,
      exploredescription,
      charges,
      country,
      qualification,
      workExperience,
      preferredCurrency,
      imageUrl: result.secure_url, // Cloudinary image URL
    });

    await newDoctor.save();
    res
      .status(201)
      .send({
        message: "Doctor profile created successfully",
        doctor: newDoctor,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error creating doctor profile", error: error.message });
  }
};

// Controller to Retrieves all doctor profiles from the database.
export const getAllDoctorProfiles = async (req, res) => {
  try {
    const doctors = await DoctorProfile.find().populate("userId"); // Fetch all profiles  // find({})  res.status(200).send(doctors)
    res
      .status(200)
      .send({ message: "Doctor profiles retrieved successfully", doctors });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        message: "Error fetching doctor profiles",
        error: error.message,
      });
  }
};

// Controller to Fetches a specific profile based on the provided ID.
export const getDoctorProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Received userId:", userId);

    // Check if userId is valid as an ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

     // Convert userId to ObjectId using `new`
    //  const objectId = new mongoose.Types.ObjectId(userId);
    const doctor = await DoctorProfile.findOne({ userId }).populate('userId');
    console.log("Doctor profile fetched:", doctor);

    if (!doctor) {
      return res.status(404).send({ message: "Doctor profile not found" });
    }
    res
      .status(200)
      .json({ message: "Doctor profile retrieved successfully", doctor });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching doctor profile", error: error.message });
  }
};

//Controller to update the doctor profile
export const updateDoctorProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    // const updates = req.body;

    // Check if the profile exists
    const doctor = await DoctorProfile.findOne({ userId });
    if (!doctor) {
      return res.status(404).send({ message: "Doctor profile not found" });
    }

    // Handle uploaded image
    let imageUrl = doctor.imageUrl;

    // If an image is uploaded, update the image URL
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "doctor_profiles",
      });
      imageUrl = result.secure_url; // Set the new Cloudinary image URL
    }

    // Prepare updated fields
    const updatedFields = {
      ...req.body, // Include all form-data fields
      imageUrl, // Include the updated image URL
    };

    // Update the doctor profile in the database
    const updatedDoctor = await DoctorProfile.findOneAndUpdate(
      { userId },
      updatedFields,
      {
        new: true, // Return the updated document
        runValidators: true, // Validate fields during update
      }
    );

    res.status(200).send({
      message: "Doctor profile updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Error updating doctor profile",
      error: error.message,
    });
  }
};
// Multer middleware to process form-data
export const multerMiddleware = upload.single("image");

//Controller to Delete the profile.
export const deleteDoctorProfileById = async (req, res) => {
  try {
    const { userId } = req.params; // Extract ID from request parameters
    const doctor = await DoctorProfile.findOneAndDelete({ userId }); // Delete profile by ID

    if (!doctor) {
      return res.status(404).send({ message: "Doctor profile not found" });
    }

    res.status(200).send({ message: "Doctor profile deleted successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ message: "Error deleting doctor profile", error: error.message });
  }
};
