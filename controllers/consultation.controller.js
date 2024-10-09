import consultationSchema from "../models/bookingConsultation.model.js";

// export  const bookConsultation = async(req, res) => {
//     try {
//       const consultation =  await consultationSchema.create(req.body);
//       res.status(200).json(consultation);
//     } catch (error) {
//     res.status(500).json({message: error.message});

//     }
// };
export const bookConsultation = async (req, res) => {
  try {
    console.log("Received files:", req.files);
    // If files are uploaded, map over them to create the image objects
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        filename: file.filename,
        url: `http://localhost:3000/uploads/${file.filename}`, // Adjust the URL as per your setup
      }));
    }

    // Formatting the prefferDate before storing
    if (req.body.prefferDate) {
      const date = new Date(req.body.prefferDate);
      const options = {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      req.body.prefferDate = date.toLocaleString("en-US", options);
    }

    // Create a new consultation entry with the images included
    const consultation = await consultationSchema.create({
      ...req.body,
      images: images,
    });
    console.log("Saved consultation:", consultation);

    res.status(200).json(consultation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const bookConsultation = async (req, res) => {
//     try {
//       console.log("Received images:", req.body.images); // Log the received images

//       const consultation = await consultationSchema.create(req.body);

//       res.status(200).json(consultation);
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };

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
