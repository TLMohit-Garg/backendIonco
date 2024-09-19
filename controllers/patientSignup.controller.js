import Signup from"../models/signup.model.js";
import mongoose from 'mongoose';


// export  const patientRegistration = async(req, res) => {
//     try {
//         const signup = await Signup.create(req.body);
//         res.status(201).json(signup);
//     } catch (error) {
//     res.status(500).json({message: error.message});
//     }
// };
export const patientRegistration = async (req, res) => {
    const { email, ...otherFields } = req.body;
  
    try {
      // Check if the email already exists
      const existingUser = await Signup.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already exists. Please use a different email.' });
      }
  
      // If email is unique, create a new user
      const newUser = await Signup.create({ email, ...otherFields });
      res.status(201).json({ message: 'Signup successful', user: newUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

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

    // Find patient by ID
    const patient = await Signup.findById(id);

    // Check if patient exists
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