import VideocallConsultation from "../models/videoLinkConsultationDetails.js";

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

    return res.json({ link: videoCallLink });
  } catch (error) {
    console.error("Error generating video call link:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Controller function to get consultation by ID
export const getConsultationById = async (req, res) => {
  try {
    const { id } = req.params;
    const consultation = await VideocallConsultation.findById(id);
    if (!consultation) {
      return res.status(404).json({ error: "Consultation not found" });
    }
    return res.json(consultation);
  } catch (error) {
    console.error("Error fetching consultation:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

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
  const { consultationId } = req.params;          // Consultation ID is in the URL
  const {notes, doctorId} = req.body;              // Notes and doctorId are in the request body

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
          notes: notes,               // Update the "notes" field with new notes
          lastUpdated: Date.now(),    // Optionally, track when the notes were last updated
        },
      },
      { new: true }                   // Return the updated document
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
 