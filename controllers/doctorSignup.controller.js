import DoctorSignup from "../models/doctorsignup.model.js";
import mongoose from 'mongoose';


// export  const doctorRegistration = async(req, res) => {
//     try {
//         const signup = await DoctorSignup.create(req.body);
//         res.status(201).json(signup);
//     } catch (error) {
//     res.status(500).json({message: error.message});
//     }
// };

export const doctorRegistration = async (req, res) => {
    const { email, ...otherFields } = req.body;
  
    try {
      const existingUser = await DoctorSignup.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Email already exists. Please use a different email.' });
      }
  
      const newUser = await DoctorSignup.create({ email, ...otherFields });
      res.status(201).json({ message: 'Signup successful', user: newUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
// export const getdoctors = async(req, res) => {
//     try{
//        const doctors = await DoctorSignup.find({});
//        res.status(200).json(doctors);
//     }catch(error){
//     res.status(500).json({message: error.message});
//     }
// };

//Get the doctor's data
export const getDoctors = async (req, res) => {
  try {
    const doctors = await DoctorSignup.find({});

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
    const doctor = await DoctorSignup.findById(id);

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
    const doctor = await DoctorSignup.findByIdAndUpdate(id, req.body, {
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
    const doctor = await DoctorSignup.findByIdAndDelete(id);

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