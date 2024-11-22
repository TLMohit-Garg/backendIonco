import VideocallConsultation from "../models/videoLinkConsultationDetails.js";
import DoctorSignup from "../models/doctorsignup.model.js";
import Signup from "../models/signup.model.js";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Controller function to generate video call link
export const generateVideoCallLink = async (req, res) => {
  const { patientId, doctorId, consultationTime, patientEmail, doctorEmail } = req.body;

  // Validate IDs
  if (!isValidObjectId(patientId) || !isValidObjectId(doctorId)) {
    return res.status(400).json({ error: "Invalid patientId or doctorId" });
  }

  if (!patientId || !doctorId || !consultationTime || !patientEmail || !doctorEmail) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {

     // Convert string IDs to ObjectId
     const patientObjectId = new mongoose.Types.ObjectId(patientId);
     const doctorObjectId = new mongoose.Types.ObjectId(doctorId);

    const roomName = `consultation-${doctorId}-${patientId}-${Date.now()}`;
    const videoCallLink = `https://meet.jit.si/${roomName}`;

    // Save consultation details to the database
    const newConsultation = new VideocallConsultation({
      patientId: patientObjectId,
      doctorId: doctorObjectId,
      consultationTime,
      videoCallLink,
    });

    await newConsultation.save();
    const emailContent = `
    <h3>Video Consultation Scheduled</h3>
    <p>Your consultation is scheduled at: ${new Date(consultationTime).toLocaleString()}</p>
    <p>Click <a href="${videoCallLink}">here</a> to join the video call.</p>
  `;

  await sendEmail(patientEmail, "Your Video Consultation Link", emailContent);
  await sendEmail(doctorEmail, "Your Video Consultation Link", emailContent);
    // Send the video call link via email
    // await sendVideoCallEmails(patientEmail, doctorEmail, videoCallLink, consultationTime);

    return res.json({
      message: "Link generated and emails sent successfully",
      link: videoCallLink,
      consultationId: newConsultation._id,
    });
  } catch (error) {
    console.error("Error generating video call link:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Function to send email to both doctor and patient
// const sendVideoCallEmails = async (patientEmail, doctorEmail, videoCallLink, consultationTime) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER, // Your email
//         pass: process.env.EMAIL_PASS, // App-specific password
//       },
//     });

//     const mailOptions = [
//       {
//         from: process.env.EMAIL_USER,
//         to: patientEmail,
//         subject: "Your Video Consultation Link",
//         text: `Dear Patient,\n\nYour video consultation is scheduled at ${consultationTime}.\nHere is your video link: ${videoCallLink}\n\nPlease join at the scheduled time.\n\nBest regards,\nYour Healthcare Team`,
//       },
//       {
//         from: process.env.EMAIL_USER,
//         to: doctorEmail,
//         subject: "Video Consultation Link",
//         text: `Dear Doctor,\n\nYou have a scheduled video consultation at ${consultationTime}.\nHere is the video link: ${videoCallLink}\n\nPlease join at the scheduled time.\n\nBest regards,\nYour Healthcare Team`,
//       },
//     ];

//     // await Promise.all(mailOptions.map((mail) => transporter.sendMail(mail)));
//     await transporter.sendMail(mailOptions);

//     console.log("Emails sent successfully to patient and doctor.");
//   } catch (error) {
//     console.error("Failed to send emails:", error.message);
//   }
// };
const sendEmail = async (to, subject, content) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // App-specific password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: content,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error.message);
  }
};



// Controller function to get consultation by ID
// export const getConsultationById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const consultation = await VideocallConsultation.findById(id);
//     if (!consultation) {
//       return res.status(404).json({ error: "Consultation not found" });
//     }
//     return res.json(consultation);
//   } catch (error) {
//     console.error("Error fetching consultation:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// Controller function for save consultation notes
export const saveConsultationNotes = async (req, res) => {
  const { consultationId, notes, doctorId } = req.body;

  // Validation: Check if all required fields are present
  if ((!consultationId, !notes, !doctorId)) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const updateConsultation = await VideocallConsultation.findByIdAndUpdate(
      consultationId,
      {
        $set: {
          notes, // Update consultation notes
          endTime: Date.now(), // Set end time when the notes are saved
        },
      },
      { new: true } // Return the updated document
    );

    if (!updateConsultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }
    res.json({
      message: "Consultation notes saved successfully.",
      consultation: updateConsultation,
    });
  } catch (error) {
    console.error("Error saving consultation notes:", error);
    return res
      .status(500)
      .json({ error: "Failed to save consultation notes." });
  }
};

// Controller function for update the notes.
export const updateNotes = async (req, res) => {
  const { consultationId } = req.params; // Consultation ID is in the URL
  const { notes, doctorId } = req.body; // Notes and doctorId are in the request body

  // Check if the required fields are provided
  if (!consultationId || !notes || !doctorId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    // Update the consultation notes
    const updatedConsultation = await VideocallConsultation.findByIdAndUpdate(
      consultationId,
      {
        $set: {
          notes: notes, // Update the "notes" field with new notes
          lastUpdated: Date.now(), // Optionally, track when the notes were last updated
        },
      },
      { new: true } // Return the updated document
    );

    // If the consultation is not found, return an error
    if (!updatedConsultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }

    // Return the updated consultation with the new notes
    res.json({
      message: "Consultation notes updated successfully.",
      consultation: updatedConsultation,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Failed to update consultation notes." });
  }
};

// export const getConsultationsByUser = async (req, res) => {
//   const { userId } = req.params; // Get the userId from the request params
//   try {

//     let consultations;

//     // Check if userId corresponds to a doctor
//     const doctor = await DoctorSignup.findById(userId);
//     // console.log(doctor,"doctor id to test")
//     if (doctor) {
//       const consultations = await VideocallConsultation.find({ doctorId: userId }).populate("doctorId","firstName");
//       console.log("doctor consultations",consultations);
//       return res.json(consultations);
//     }

//     // Check if userId corresponds to a patient
//     const patient = await Signup.findById(userId);
//     // console.log(patient,"patient id to test")

//     if (patient) {
//       const consultations = await VideocallConsultation.find({ patientId: userId }).populate("patientId","firstName");
//       console.log("patient consultations",consultations);
//       return res.json(consultations);
//     }

//     // If neither, return an error
//     return res.json(consultations);
//   } catch (error) {
//     console.error("Error fetching consultations:", error);
//     return res.status(500).json({ error: "Internal server error" });
//   }
// };

// Updated getConsultationsByUser function
export const getConsultationsByUser = async (req, res) => {
  const { userId } = req.params; // Get the userId from the request params
  try {
    // Fetch consultations and populate doctorId and patientId
    const consultations = await VideocallConsultation.find()
      .populate("patientId", "firstName") // Populating patientId
      .populate("doctorId", "firstName"); // Populating doctorId

    // Filter consultations by userId (doctor or patient)
    const filteredConsultations = consultations.filter(
      (consultation) =>
        (consultation.doctorId &&
          consultation.doctorId._id.toString() === userId) ||
        (consultation.patientId &&
          consultation.patientId._id.toString() === userId)
    );

    return res.json(filteredConsultations);
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
