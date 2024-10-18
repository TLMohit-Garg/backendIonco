import VideocallConsultation from '../models/videoLinkConsultationDetails.js';

// Controller function to generate video call link
export const generateVideoCallLink = async (req, res) => {
  const { patientId, doctorId, consultationTime } = req.body;

  if (!patientId || !doctorId || !consultationTime) {
    return res.status(400).json({ error: 'Missing required fields' });
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
    console.error('Error generating video call link:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller function to get consultation by ID
export const getConsultationById = async (req, res) => {
  try {
    const { id } = req.params;
    const consultation = await VideocallConsultation.findById(id);
    if (!consultation) {
      return res.status(404).json({ error: 'Consultation not found' });
    }
    return res.json(consultation);
  } catch (error) {
    console.error('Error fetching consultation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
