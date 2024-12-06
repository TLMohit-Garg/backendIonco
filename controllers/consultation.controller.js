import consultationSchema from "../models/bookingConsultation.model.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import pug from "pug";
import mongoose from "mongoose";

// Multer setup for parsing form-data
const upload = multer({ dest: "patientDocsUpload/" });
dotenv.config();

export const bookConsultation = async (req, res) => {
  const {
    doctorId,
    fullName,
    email,
    prefferDate,
    nationality,
    timezone,
    cancertype,
    phone,
    description,
  } = req.body;
  console.log("req.file is :-", req.files);

   // Ensure the image file is uploaded
   if (!req.files || req.files.length === 0) {
    return res.status(400).send({ message: "No image file uploaded" });
  }
  if (!doctorId || !fullName  || !prefferDate) {
    return res.status(400).json({ message: "All required fields must be provided." });
  }

  try {
    // Upload all files to Cloudinary
    const uploadPromises = req.files.map((file) =>
      cloudinary.uploader.upload(file.path, { folder: 'patientDocuments' })
    );
    const uploadResults = await Promise.all(uploadPromises);

    // Extract secure URLs from Cloudinary response
    const fileUrls = uploadResults.map((result) => result.secure_url);

    // Format the preferred date
    let formattedPrefferDate = prefferDate;
    if (prefferDate) {
      const date = new Date(prefferDate);
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      formattedPrefferDate = date.toLocaleString("en-US", options);
    }

    
    // Create a new consultation entry
    const consultation = await consultationSchema.create({
      fullName,
      email,
      prefferDate: formattedPrefferDate,
      nationality,
      timezone,
      cancertype,
      phone,
      description,
      doctorId,
      images: fileUrls, // Use Cloudinary's URL for the uploaded file
    });
    console.log("Saved consultation:", consultation);
    
 // Populate doctor details
 const populatedConsultation = await consultationSchema
 .findById(consultation._id)
 .populate({
  path: "doctorId",
  populate: { path: "userId" }, // Populate the userId inside doctorId
});

console.log("populateEntiredata :-", populatedConsultation);
    // Assuming `populatedConsultation` contains the populated response
if (populatedConsultation?.doctorId?.userId) {
  const doctorUserId = populatedConsultation.doctorId.userId._id;
  const doctorFirstName = populatedConsultation.doctorId.userId?.firstName;
  const doctorLastName = populatedConsultation.doctorId.userId?.lastName;
  const doctorEmail = populatedConsultation.doctorId.userId?.email;

  console.log("Doctor User ID:", doctorUserId);
  console.log("Doctor First Name:", doctorFirstName);
  console.log("Doctor Last Name:", doctorLastName);
  console.log("Doctor Email:", doctorEmail);
} else {
  console.log("Doctor or User data is missing in the populated response.");
}


const doctorEmail = populatedConsultation?.doctorId?.userId?.email;
const doctorName = populatedConsultation?.doctorId?.userId?.firstName;

if (!email || !doctorEmail || !process.env.ADMIN_EMAIL) {
  throw new Error("Missing required email addresses.");
}

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Path to the Pug templates
    const patientTemplatePath = path.resolve("emailTemplates", "patientBooking.pug");
    const doctorTemplatePath = path.resolve("emailTemplates", "doctorNotification.pug");
    const adminTemplatePath = path.resolve("emailTemplates", "adminBookingNotification.pug");

    // Render the Pug templates
    const patientMailHtml = pug.renderFile(patientTemplatePath, {
      fullName,
      doctorName,
      prefferDate: formattedPrefferDate,
      cancertype,
      timezone,
    });

    const doctorMailHtml = pug.renderFile(doctorTemplatePath, {
      doctorName, // Assuming `fullName` exists for doctors
      patientName: fullName,
      prefferDate: formattedPrefferDate,
      description,
    });

    const adminMailHtml = pug.renderFile(adminTemplatePath, {
      patientName: fullName,
      doctorName,
      prefferDate: formattedPrefferDate,
      details: JSON.stringify({ nationality, timezone, cancertype, phone }, null, 2),
    });

    // Email to the patient
    const patientMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Consultation Booking Confirmation",
      html: patientMailHtml,
    };

    // Email to the doctor
    const doctorMailOptions = {
      from: process.env.EMAIL_USER,
      to: doctorEmail, // Doctor's email fetched from the database
      subject: "New Consultation Booking Notification",
      html: doctorMailHtml,
    };

    // Email to the admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL, // Admin email stored in .env
      subject: "New Consultation Booking Details",
      html: adminMailHtml,
    };

    // Send the emails
    await transporter.sendMail(patientMailOptions);
    await transporter.sendMail(doctorMailOptions);
    await transporter.sendMail(adminMailOptions);

    res.status(201).json({
      message: "Consultation booked successfully",
      consultation: populatedConsultation,
    });
  } catch (error) {
    console.error("Error booking consultation:", error);
    res.status(500).json({ message: error.message });
  }
};

// controller to get consultation detail
export const getConsultation = async (req, res) => {
  try {
    const consultationDetails = await consultationSchema.find({});
    res.status(200).json(consultationDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// controller to get consultation by id

export const getconsultationId = async (req, res) => {
  try {
    const { id } = req.params;
    const consultationDetails = await consultationSchema.findById(id);
    res.status(200).json(consultationDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Get request consultation with doctorId 
export const getConsultationsByDoctorId = async (req, res) => {
  const { doctorId } = req.params;

  // Validate the doctorId
  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).json({ error: "Invalid doctor ID" });
  }

  console.log("Doctor ID from params:", doctorId);
  try {
    // Query consultations based on doctorId
    const consultations = await consultationSchema
      .find({ doctorId: doctorId })
      // .populate("doctorId", "name price") // Adjust based on fields in Doctor schema
      .populate({
        path: "doctorId", // Reference the doctorId field
        model: "Doctor", // Name of the model
      })
      .sort({ createdAt: -1 }); // Sort by latest first

      console.log("Consultations fetched:", consultations);

    // Handle if no consultations found
    if (!consultations.length) {
      return res.status(200).json({ message: "No consultations found for this doctor." });
    }

    res.status(200).json(consultations);
  } catch (error) {
    console.error("Error fetching consultations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


//Get request consultation with patientId
export const getConsultationsByPatientId = async (req, res) => {
  const { patientId } = req.params;
  console.log("Patient ID from params:", patientId);
  // Validate the patientId
  if (!mongoose.Types.ObjectId.isValid(patientId)) {
    return res.status(400).json({ error: "Invalid patient ID" });
  }

  try {
    // Fetch consultations for the given patientId
    const consultations = await consultationSchema
      .find({ patientId: patientId })
      // .populate("patientId", "name price") // Optionally populate doctor details
      .populate({
        path: "patientId", // Reference the doctorId field
        model: "Patient", // Name of the model
      })
      .sort({ createdAt: -1 }); // Sort by newest first

      console.log("Consultations fetched:", consultations);

    if (!consultations.length) {
      return res.status(404).json({ message: "No consultations found for this patient." });
    }

    res.status(200).json(consultations);
  } catch (error) {
    console.error("Error fetching consultations for patient:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
