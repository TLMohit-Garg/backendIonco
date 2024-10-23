import VideocallConsultation from "../models/videoLinkConsultationDetails.js";
import DoctorSignup from "../models/doctorsignup.model.js";
import Signup from "../models/signup.model.js";

// Controller function to generate video call link
export const generateVideoCallLink = async (req, res) => {
  const { patientId, doctorId, consultationTime } = req.body;

  if (!patientId || !doctorId || !consultationTime) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const roomName = `consultation-${doctorId}-${patientId}-${Date.now()}`;
    const videoCallLink = `https://meet.jit.si/${roomName}`;

    // Save consultation details to the database
    const newConsultation = new VideocallConsultation({
      patientId,
      doctorId,
      consultationTime,
      videoCallLink,
    });

    await newConsultation.save();

    return res.json({
      message: "Link generated successfully",
      link: videoCallLink,
      consultationId: newConsultation._id,
    });
  } catch (error) {
    console.error("Error generating video call link:", error);
    return res.status(500).json({ error: "Internal server error" });
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
