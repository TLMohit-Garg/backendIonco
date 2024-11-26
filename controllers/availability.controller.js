import Availability from "../models/availability.model.js";

// Controller for storing availability
export const addAvailability = async (req, res) => {
    try {
      const { doctorId, date, startTime, endTime, timezone } = req.body;
  
      const newAvailability = new Availability({
        doctorId,
        date,
        startTime,
        endTime,
        timezone,
      });
  
      await newAvailability.save();
  
      res.status(201).json({ success: true, message: "Availability added successfully",newAvailability });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to add availability", error });
    }
  };
  

// Controller for fetching availability
export const fetchAvailability = async (req, res) => {
  try {
    const availability = await Availability.find(); // Fetch all availability
    res.status(200).json(availability);
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch availability", error });
  }
};


// Controller for fetching availability by doctorId
export const fetchAvailabilityByDoctorId = async (req, res) => {
    try {
      const { doctorId } = req.params;
  
      // Fetch availability for the specific doctor
      const availability = await Availability.find({ doctorId }).populate("doctorId", "firstName lastName email");
  
      if (!availability || availability.length === 0) {
        return res.status(404).json({ success: false, message: "No availability found for the specified doctor" });
      }
  
      res.status(200).json({ success: true, availability });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch availability", error });
    }
  };
  