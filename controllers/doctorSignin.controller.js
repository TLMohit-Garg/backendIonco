import Signup from "../models/doctorsignup.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

 const JWT_SECRET = "931079ede9061896e77a0516ba2351c0a6680fa90e117cc3b3e355b7c12c7efc1893159a2ef2e0c4811e785bb69ee262b40c0686ed185eb6d49a293701c99049";
// const JWT_SECRET = process.env.JWT_SECRET;

//POST the doctor data
export const doctorSignin = async(req, res) => {
    const { email, password } = req.body;
      try {
        // Find the user by email
        const user = await Signup.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
    
        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid email or password' });
        }
    
         // Create a JWT token
         const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    
        // If successful, send a success response
        res.status(200).json({ message: 'Sign-in successful', token  });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}
//Get the doctor's data
export const getDoctors = async (req, res) => {
  try {
    const doctors = await Signup.find({});

    if (doctors.length === 0) {
      return res.status(404).json({ message: "No doctors found" });
    }

    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Get doctor by id
export const getDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the provided ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid doctor ID format" });
    }

    // Find doctor by ID
    const doctor = await Signup.findById(id);

    // Check if doctor exists
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Return the doctor details
    res.status(200).json(doctor);
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching doctor:", error);

    // Handle potential errors
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

//Update doctor
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the provided ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid doctor ID format" });
    }

    // Validate if there is a body to update
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    // Find and update the doctor by ID
    const doctor = await Signup.findByIdAndUpdate(id, req.body, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures updated data is validated against the schema
    });

    // Check if doctor exists
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Return the updated doctor details
    res.status(200).json(doctor);
  } catch (error) {
    // Log the error for debugging
    console.error("Error updating doctor:", error);

    // Handle potential errors
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

//Delete Doctor
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    // Attempt to find and delete the doctor by ID
    const doctor = await Signup.findByIdAndDelete(id);

    // Check if the doctor exists
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Return a success message
    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};