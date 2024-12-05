import mongoose from 'mongoose';

const TempConsultationSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [false, "Please enter full name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
    },
    prefferDate: {
      type: String,
      required: [false, "Please select preferred date"],
    },
    nationality: {
      type: String,
      required: [false, "Please select your nationality"],
    },
    timezone: {
      type: String,
      required: [false, "Please select your timezone"],
    },
    cancertype: {
      type: String,
      required: [false, "Please select cancer type"],
    },
    phone: {
      type: String,
      required: [false, "Please enter your phone number"],
    },
    description: {
      type: String,
      required: [false, "Provide some description if you want to..."],
    },
    images: {
      type: [String],
      required: [true, "Please upload your Docs"],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor", // Reference to the Doctor profile model
      required: [true, "Doctor is required"],
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
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentSessionId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const TempConsultation = mongoose.model("TempConsultation", TempConsultationSchema);
export default TempConsultation;


//paymentStatus: Tracks the state of the payment (pending, paid, or failed).
//paymentSessionId: Links the temporary booking with the payment session.