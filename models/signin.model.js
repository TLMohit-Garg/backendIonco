import mongoose from "mongoose";

const SignInSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter a password"],
    }
  },
  {
    timestamps: true,
  }
);



const Signin = mongoose.model("Signin", SignInSchema);
export default Signin;

