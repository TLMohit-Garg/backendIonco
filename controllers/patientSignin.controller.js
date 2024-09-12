import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Signup from "../models/signup.model.js";
import mongoose from 'mongoose';


const JWT_SECRET = "931079ede9061896e77a0516ba2351c0a6680fa90e117cc3b3e355b7c12c7efc1893159a2ef2e0c4811e785bb69ee262b40c0686ed185eb6d49a293701c99049";
// const JWT_SECRET = process.env.JWT_SECRET;

export const patientSignin = async(req, res) => {
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

//Get the patient's data
export const getPatients = async (req, res) => {
  try {
    const patients = await Signup.find({});

    if (patients.length === 0) {
      return res.status(404).json({ message: "No patients found" });
    }

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Get patient by id
export const getPatient = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the provided ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid patient ID format" });
    }

    // Find doctor by ID
    const patient = await Signup.findById(id);

    // Check if doctor exists
    if (!patient) {
      return res.status(404).json({ message: "patient not found" });
    }

    // Return the patient details
    res.status(200).json(patient);
  } catch (error) {
    // Log the error for debugging
    console.error("Error fetching patient:", error);

    // Handle potential errors
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

//Update doctor
export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the provided ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid patient ID format" });
    }

    // Validate if there is a body to update
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "No data provided for update" });
    }

    // Find and update the doctor by ID
    const patient = await Signup.findByIdAndUpdate(id, req.body, {
      new: true, // Returns the updated document
      runValidators: true, // Ensures updated data is validated against the schema
    });

    // Check if patient exists
    if (!patient) {
      return res.status(404).json({ message: "patient not found" });
    }

    // Return the updated patient details
    res.status(200).json(patient);
  } catch (error) {
    // Log the error for debugging
    console.error("Error updating patient:", error);

    // Handle potential errors
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

//Delete Doctor
export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid doctor ID" });
    }

    // Attempt to find and delete the patient by ID
    const patient = await Signup.findByIdAndDelete(id);

    // Check if the patient exists
    if (!patient) {
      return res.status(404).json({ message: "patient not found" });
    }

    // Return a success message
    res.status(200).json({ message: "patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};