import mongoose from "mongoose";

const AvailabilitySchema = new mongoose.Schema(
  {
    doctorId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to DoctorSignup schema
      ref: "doctorsignup", // Collection name of DoctorSignup
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    timezone: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt fields
);

const Availability = mongoose.model("Availability", AvailabilitySchema);

export default Availability;
