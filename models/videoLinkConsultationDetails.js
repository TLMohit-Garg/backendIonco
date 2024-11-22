import mongoose from "mongoose";

const VideocallConsultationSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId,required: true, ref:"signup"},
  doctorId: { type: mongoose.Schema.Types.ObjectId,required: true, ref:"doctorsignup"},
  consultationTime: {
    type: String,
    required: [true, "Please enter consultationTime"],
  },
  videoCallLink: { type: String },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const VideocallConsultation = mongoose.model(
  "VideoConsultation",
  VideocallConsultationSchema
);
export default VideocallConsultation;
