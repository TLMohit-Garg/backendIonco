import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  title: { type: String, required: false },
  speciality: { type: String, required: false },
  description: { type: String, required: false },
  exploredescription: { type: String, required: false },
  charges: { type: Number, required: false },
  country: { type: String, required: false },
  qualification: { type: String, required: false },
  workExperience: { type: String, required: false },
  imageUrl: { type: String, required: false }, // URL of the uploaded image in Cloudinary 
}, { timestamps: true });

const DoctorProfile = mongoose.model('Doctor', doctorSchema);

export default DoctorProfile;
