import DoctorProfile from "../models/doctorProfile.model.js"
// const cloudinary = require('../config/cloudinary'); // Cloudinary configuration
import cloudinary from "../config/cloudinary.js";

// Controller to handle doctor profile creation with image upload
export const createDoctorProfile = async (req, res) => {
  const { title, speciality, description, exploredescription, charges, country, qualification, workExperience } = req.body;

  // Ensure the image file is uploaded
  if (!req.file) {
    return res.status(400).send({ message: 'No image file uploaded' });
  }

  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'doctor_profiles', // Specify the folder for images
    });

    // Create a new doctor profile in the database
    const newDoctor = new DoctorProfile({
      title,
      speciality,
      description,
      exploredescription,
      charges,
      country,
      qualification,
      workExperience,
      imageUrl: result.secure_url, // Cloudinary image URL
    });

    await newDoctor.save();
    res.status(201).send({ message: 'Doctor profile created successfully', doctor: newDoctor });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error creating doctor profile', error: error.message });
  }
};

