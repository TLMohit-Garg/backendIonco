import DoctorSignup from "../models/doctorsignup.model.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import pug from "pug";

// const templatePath = path.join(__dirname, "..", "emailTemplates", "doctorWelcome.hbs");

// export const doctorRegistration = async (req, res) => {
//     const { email, ...otherFields } = req.body;

//     try {
//       const existingUser = await DoctorSignup.findOne({ email });
//       if (existingUser) {
//         return res.status(409).json({ message: 'Email already exists. Please use a different email.' });
//       }

//       const newUser = await DoctorSignup.create({ email, ...otherFields });
//       res.status(201).json({ message: 'Signup successful', user: newUser });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };

export const doctorRegistration = async (req, res) => {
  const { email, firstName, ...otherFields } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await DoctorSignup.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({
          message: "Email already exists. Please use a different email.",
        });
    }

    // If email is unique, create a new user
    const newUser = await DoctorSignup.create({
      email,
      firstName,
      ...otherFields,
    });

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Path to the Pug template
    const doctorTemplatePath = path.resolve(
      "emailTemplates",
      "doctorWelcome.pug"
    );
    const adminTemplatePath = path.resolve(
      "emailTemplates",
      "adminNotification.pug"
    );

    // Render the Pug templates
    const doctorMailHtml = pug.renderFile(doctorTemplatePath, {
      firstName,
      year: new Date().getFullYear(),
    });

    const adminMailHtml = pug.renderFile(adminTemplatePath, {
      firstName,
      email,
      details: JSON.stringify(otherFields, null, 2),
      year: new Date().getFullYear(),
    });

    // Email to the new doctor
    const doctorMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our Platform",
      html: doctorMailHtml,
      // template: "doctorWelcome",
      // context: {
      //   firstName,
      //   year: new Date().getFullYear(),
      // },
      // text: `Hi Dr. ${firstName},\n\nThank you for registering with us. We are thrilled to have you onboard as part of our team!\n\nBest Regards,\nTeleconsultation-IoncoSolutions`,
    };

    // Email to the admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: "tl.webcodeft@gmail.com", // Replace with your admin email
      subject: "New Doctor Registration",
      html: adminMailHtml,
      // template: "adminNotification",
      // context: { 
      //   firstName,
      //   email,
      //   details: JSON.stringify(otherFields, null, 2),
      //   year: new Date().getFullYear(),
      // },
      // text: `Hi Admin,\n\nA new doctor has registered on the platform.
      // \n\nDetails:\nName: Dr. ${firstName}\nEmail: ${email}\nOther Details: ${JSON.stringify(
      //   otherFields,
      //   null,
      //   2
      // )}\n\nBest Regards,\nTeleconsultation-IoncoSolutions`,
    };

    // Send the emails
    await transporter.sendMail(doctorMailOptions);
    await transporter.sendMail(adminMailOptions);

    res.status(201).json({ message: "Signup successful", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
