import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "doctorsignup",
      required: true,
    }, // Reference to DoctorSignup
    title: { type: String, required: [true, "Please enter your Name"] },
    speciality: {
      type: String,
      required: [true, "Please enter your speciality"],
    },
    description: {
      type: String,
      required: [true, "Please enter your description"],
    },
    exploredescription: { type: String },
    charges: { type: String, required: [true, "Please define your charges"] },
    country: { type: String, required: [true, "Please select your country"] },
    qualification: {
      type: String,
      required: [true, "Please enter your qualification"],
    },
    workExperience: {
      type: String,
      required: [true, "Please mention your workExperience"],
    },
    imageUrl: { type: String, required: [true, "Please upload your image"] }, // URL of the uploaded image in Cloudinary
  },
  { timestamps: true }
);

const DoctorProfile = mongoose.model("Doctor", doctorSchema);

export default DoctorProfile;
