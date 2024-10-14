import mongoose from "mongoose";

const DoctorConsultationSchema = mongoose.Schema(
  {
    patientEmail: {
      type: String,
      required: false, 
    },
    doctorName: {
      type: String,
      required: false, 
    },
    doctorPrice: {
      type: String,
      required: false, 
    },
    preferredCurrency: {
      type: String,
      required: false, 
    },
    consultationDate: {
      type: String,
      required: false, 
    },
    // serviceCharges: {
    //   type: String,
    //   required: false, 
    // },
    
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const DoctorConsultation = mongoose.model("DoctorConsultation", DoctorConsultationSchema);
export default DoctorConsultation;
