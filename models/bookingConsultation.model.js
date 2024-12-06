import mongoose from "mongoose";

const ConsultationSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please enter full name"],
    },
    email: {  
      type: String,
      required: [false, "Please enter your email"],
      unique: false,
    },
    prefferDate: {
      type: String,
      required: [true, "Please select preffer date"],
    },
    nationality: {
      type: String,
      required: [true, "Please select your nationality"],
    },
    timezone: {
      type: String,
      required: [true, "Please select your timezone"],
    },
    cancertype: {
      type: String,
      required: [false, "Please select cancer type"],
    },
    phone: {
      type: String,
      required: [true, "Please enter your phone number"],
    },
    description: {
      type: String,
      required: ["Provide some description if you want to..."],
    },
    images:{ type: [String], required: [true, "Please upload your Docs"] },
    doctorId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Doctor",  // This will reference the Doctor profile model
      required: [true, "Doctor is required"]
    },
    doctorName: {
      type: String,
      ref: "Doctor", // Reference to the Doctor profile model
      required: [false, "DoctorName is required"],
    },
    doctorPrice: {
      type: String,
      ref: "Doctor", // Reference to the Doctor profile model
      required: [false, "doctorPrice is required"],
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient", // Reference to the Patient profile model
      required: [false, "Patient is required"],
    },
  },
  
  {
    timestamps: true,
  }
);

const consultationSchema = mongoose.model("consultation", ConsultationSchema);
export default consultationSchema;
