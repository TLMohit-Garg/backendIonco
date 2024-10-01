import jwt from "jsonwebtoken";
import Signup from "../models/signup.model.js";
// import AdminSignin from "../models/adminSignin.model.js";
import bcrypt from "bcrypt";

// const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET =
  "931079ede9061896e77a0516ba2351c0a6680fa90e117cc3b3e355b7c12c7efc1893159a2ef2e0c4811e785bb69ee262b40c0686ed185eb6d49a293701c99049";
export const userSignin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await Signup.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Compare the entered password with the stored hashed password using bcrypt
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create a JWT token
    const token = jwt.sign({ userId: user._id}, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      message: "ADMIN has Sign-in successful",
      user: {
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
