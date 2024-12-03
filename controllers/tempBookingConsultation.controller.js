import TempConsultation from "../models/tempConsultation.model.js";
import Consultation  from "../models/bookingConsultation.model.js";
import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_KEY);

//get request controller
export const getTempConsultationBookingSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Fetch session details from Stripe
    const stripeResponse = await axios.get(
      `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
      {
        headers: {
          Authorization: `Bearer YOUR_SECRET_STRIPE_KEY`,
        },
      }
    );

    const sessionData = stripeResponse.data;

    // Fetch the temporary booking
    const tempBooking = await TempConsultation.findOne({
      paymentSessionId: sessionId,
    });

    if (!tempBooking) {
      return res.status(404).json({ message: "Temporary booking not found" });
    }

    // Check payment status and handle accordingly
    if (sessionData.payment_status === "paid") {
      const finalBooking = new Consultation ({
        fullName: tempBooking.fullName,
        email: tempBooking.email,
        prefferDate: tempBooking.prefferDate,
        nationality: tempBooking.nationality,
        timezone: tempBooking.timezone,
        cancertype: tempBooking.cancertype,
        phone: tempBooking.phone,
        description: tempBooking.description,
        images: tempBooking.images,
        doctorId: tempBooking.doctorId,
      });

      await finalBooking.save();

      // Optionally, delete the temporary booking
      await TempConsultation.deleteOne({ _id: tempBooking._id });

      return res.status(200).json({
        message: "Booking confirmed and saved successfully",
        bookingId: finalBooking._id,
      });
    }

    return res
      .status(400)
      .json({ message: "Payment failed, booking not confirmed" });
  } catch (error) {
    console.error("Error finalizing booking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Post request controller
export const createTempConsultation = async (req, res) => {
    try {
      const {
        fullName,
        email,
        prefferDate,
        nationality,
        timezone,
        cancertype,
        phone,
        description,
        doctorId,
      } = req.body;
  
      // Extract images if available (assuming multer handles them)
      const images = req.files ? req.files.map((file) => file.path) : [];
  
      // Create a temporary consultation without paymentSessionId
      const tempConsultation = new TempConsultation({
        fullName,
        email,
        prefferDate,
        nationality,
        timezone,
        cancertype,
        phone,
        description,
        images,
        doctorId,
        paymentStatus: 'pending', // Default to pending
      });
  
      const savedConsultation = await tempConsultation.save();
  
      // Create Stripe Checkout Session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: `Consultation with ${doctorId}`,
              },
              unit_amount: 5000, // Amount in cents ($50.00)
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `http://localhost:3000/success?sessionId={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:3000/cancel`,
      });
  
      // Update the temp booking with the paymentSessionId
      savedConsultation.paymentSessionId = session.id;
      await savedConsultation.save();
  
      // Respond with the Stripe session URL
      res.status(200).json({ sessionUrl: session.url });
    } catch (error) {
      console.error('Error creating temporary consultation:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
