import mongoose from "mongoose";

const VideocallConsultationSchema = new mongoose.Schema({
    patientId: { type: String, required: [true, "Please enter patientId"] },
    doctorId: { type: String, required: [true, "Please enter doctorId"] },
    consultationTime: { type: Date, required: [true, "Please enter consultationTime"] },
    videoCallLink: { type: String },
    createdAt: { type: Date, default: Date.now }
  });

   const VideocallConsultation = mongoose.model('VideoConsultation', VideocallConsultationSchema);
   export default VideocallConsultation;