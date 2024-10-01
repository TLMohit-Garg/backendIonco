import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const AdminSigninSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
    },
    
},
{
    timestamps: true,
  }
);

AdminSigninSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
  
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  
    next();
  });
  
  const AdminSignin = mongoose.model("adminsignin", AdminSigninSchema);
  export default AdminSignin;