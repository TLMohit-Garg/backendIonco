import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const DoctorsignupSchema = mongoose.Schema(
  {
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
      required: [true, "Please enter your phone number"]
    },
    nationality:{
      type: String,
      required:[true, "Please select your nationality"]
    },
    gender:{
      type: String,
      required:[true, "Please select your gender"]
    }
  },
  {
    timestamps: true,
  }
);

// Middleware to hash the password before saving the document
DoctorsignupSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

const DoctorSignup = mongoose.model("doctorsignup", DoctorsignupSchema);
export default DoctorSignup;




// DoctorsignupSchema.pre('save', async function (next) {...}): This middleware runs before saving a document. 
// It checks if the password field has been modified. If not, it simply proceeds with saving.


// Password hashing: If the password field has been modified
// (or it's a new document), it hashes the password using bcrypt before saving it in the database. 
// This ensures that passwords are stored securely.