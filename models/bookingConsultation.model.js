import mongoose from "mongoose";

const ConsultationSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Please enter full name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
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
      required: [true, "Please select cancer type"],
    },
    phone: {
      type: String,
      required: [true, "Please enter your phone number"],
    },
    description: {
      type: String,
      required: ["Provide some description if you want to..."],
    },
    images: [
        {
          filename: {
            type: String,
            required: true,
          },
          url: {
            type: String,
            required: true,
          },
        }
      ],
  },
  {
    timestamps: true,
  }
);

const consultationSchema = mongoose.model("consultation", ConsultationSchema);
export default consultationSchema;
