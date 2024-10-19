import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    // Common fields for both doctor and patient
    firstName: {
      type: String,
      required: [true, "Please enter your first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please enter your last name"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
    },
    age: {
      type: String,
      required: [true, "Please enter your age"],
    },
    phone: {
      type: String,
      required: [true, "Please enter your phone number"],
    },
    nationality: {
      type: String,
      required: [true, "Please select your nationality"],
    },
    gender: {
      type: String,
      required: [true, "Please select your gender"],
    },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'admin'], // Define roles
      required: true,
    },
    
    // Doctor-specific fields (only filled for doctors)
    doctorProfile: {
      specialty: {
        type: String,
        // required: function () {
        //   return this.role === 'doctor' && !!this.specialty; // Required if role is doctor
        // },
        required: false
      },
      licenseNumber: {
        type: String,
        required: false
      },
      experience: {
        type: String,
        required: false
      },
      profileImage: {
        type: String, // You can store the image URL here (from Cloudinary, AWS S3, etc.)
        required: false, 
      },
    },
    
    // Patient-specific fields (only filled for patients)
    patientProfile: {
      medicalHistory: {
        type: String,
        required: false,
      },
      insuranceDetails: {
        type: String,
        required: false,
      },
      profileImage: {
        type: String, // You can store the image URL here (from Cloudinary, AWS S3, etc.)
        required: false, // Optional depending on whether it's mandatory for the doctor
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt timestamps
  }
);
// Model creation
const User = mongoose.model('User', userSchema);
export default User;
