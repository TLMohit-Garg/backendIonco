import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "signup", // Reference to the signup/authentication model
      required: true,
    },
    fullName: {
      type: String,
      required: [true, "Please enter your full name"],
    },
    timezone: {
      type: String,
      required: [false, "Please select your timezone"],
    },
    imageUrl: { 
      type: String, 
      required: [false, "Please upload your image"] 
    }, // Optional profile picture
  },
  { timestamps: true }
);

const PatientProfile = mongoose.model("Patient", patientSchema);

export default PatientProfile;
