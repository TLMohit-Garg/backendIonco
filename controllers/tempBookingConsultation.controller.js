import TempConsultation from "../models/tempConsultation.model.js";
import Consultation from "../models/bookingConsultation.model.js";
import dotenv from "dotenv";
import Stripe from "stripe";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";
import nodemailer from "nodemailer";
import path from "path";
import pug from "pug";


// Multer setup for parsing form-data
const upload = multer({ dest: "patientDocsUpload/" });
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_KEY);
const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.CLIENT_URL_LIVE
    : process.env.CLIENT_URL_LOCAL;

//get request controller
export const getTempConsultationBookingSession = async (req, res) => {
  const { sessionId } = req.params;

  try {
    // Fetch session details directly from Stripe using the sessionId
    const sessionData = await stripe.checkout.sessions.retrieve(sessionId);
    // const sessionData = stripeResponse.data;

    // Fetch the temporary booking from the TempConsultation collection
    const tempBooking = await TempConsultation.findOne({
      paymentSessionId: sessionId,
    });
    console.log("find the paymentSessionId in TempConsultation schema",tempBooking);

    if (!tempBooking) {
      return res.status(404).json({ message: "Temporary booking not found" });
    }

    // Check payment status and handle accordingly
    if (sessionData.payment_status === "paid") {
      const finalBooking = new Consultation({
        fullName: tempBooking.fullName,
        email: tempBooking.email,
        prefferDate: tempBooking.prefferDate,
        nationality: tempBooking.nationality,
        timezone: tempBooking.timezone,
        // cancertype: tempBooking.cancertype,
        phone: tempBooking.phone,
        description: tempBooking.description,
        images: tempBooking.images,
        doctorId: tempBooking.doctorId,
      });

      await finalBooking.save();

      // Optionally, delete the temporary booking
      await TempConsultation.deleteOne({ _id: tempBooking._id });

      // Send email notifications
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      // Define paths for the Pug email templates
      const patientTemplatePath = path.resolve(
        "emailTemplates",
        "patientBooking.pug"
      );
      const doctorTemplatePath = path.resolve(
        "emailTemplates",
        "doctorNotification.pug"
      );
      const adminTemplatePath = path.resolve(
        "emailTemplates",
        "adminBookingNotification.pug"
      );

      // Populate doctor details
      const populatedBooking = await Consultation.findById(finalBooking._id).populate({
        path: "doctorId",
        populate: { path: "userId" },
      });

      const doctorEmail = populatedBooking?.doctorId?.userId?.email;
      const doctorName = populatedBooking?.doctorId?.userId?.firstName;

      // Render Pug templates
      const patientMailHtml = pug.renderFile(patientTemplatePath, {
        fullName: tempBooking.fullName,
        doctorName,
        prefferDate: tempBooking.prefferDate,
        // cancertype: tempBooking.cancertype,
        timezone: tempBooking.timezone,
      });

      const doctorMailHtml = pug.renderFile(doctorTemplatePath, {
        doctorName,
        patientName: tempBooking.fullName,
        prefferDate: tempBooking.prefferDate,
        description: tempBooking.description,
      });

      const adminMailHtml = pug.renderFile(adminTemplatePath, {
        patientName: tempBooking.fullName,
        doctorName,
        prefferDate: tempBooking.prefferDate,
        details: JSON.stringify(
          {
            nationality: tempBooking.nationality,
            timezone: tempBooking.timezone,
            // cancertype: tempBooking.cancertype,
            phone: tempBooking.phone,
          },
          null,
          2
        ),
      });

      // Email options
      const patientMailOptions = {
        from: process.env.EMAIL_USER,
        to: tempBooking.email,
        subject: "Your Consultation Booking Confirmation",
        html: patientMailHtml,
      };

      const doctorMailOptions = {
        from: process.env.EMAIL_USER,
        to: doctorEmail,
        subject: "New Consultation Booking Notification",
        html: doctorMailHtml,
      };

      const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.ADMIN_EMAIL,
        subject: "New Consultation Booking Details",
        html: adminMailHtml,
      };

      // Send the emails
      await transporter.sendMail(patientMailOptions);
      await transporter.sendMail(doctorMailOptions);
      await transporter.sendMail(adminMailOptions);

      // Return success response
      return res.status(200).json({
        message: "Booking confirmed and saved successfully",
        bookingId: finalBooking._id,
        bookingDetails: populatedBooking,
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
  
    const {
      fullName,
      email,
      prefferDate,
      nationality,
      timezone,
      // cancertype,
      phone,
      description,
      doctorId,
      doctorName,
      doctorPrice,
      preferredCurrency,
    } = req.body;

    // Validate essential fields
    // if (
    //   !email ||
    //   !doctorId ||
    //   !doctorPrice ||
    //   !doctorName ||
    //   !preferredCurrency
    // ) {
    //   return res.status(400).json({
    //     message:
    //       "Missing required fields. Please provide email, doctorId, doctorPrice, doctorName, and preferredCurrency.",
    //   });
    // }

    // Extract images if available (assuming multer handles them)
    // const images = req.files
    //   ? req.files.map((file) => file.path)
    //   : req.body.images || [];
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

    // Create a temporary consultation without paymentSessionId
    const tempConsultation = new TempConsultation({
      fullName,
      email,
      prefferDate: formattedPrefferDate,
      nationality,
      timezone,
      // cancertype,
      phone,
      description,
      images: fileUrls,
      doctorId,
      paymentStatus: "pending", // Default to pending
    });

    const savedConsultation = await tempConsultation.save();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      line_items: [
        {
          price_data: {
            // currency: preferredCurrency ? preferredCurrency.toLowerCase(): 'inr',
            currency: (preferredCurrency || 'inr').toLowerCase(),
            product_data: {
              name: `Consultation with Dr. ${doctorName}`,
              description: `15% Service charges included.`,
            },
            unit_amount: Math.round(doctorPrice * 100), // Stripe requires price in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,
      metadata: {
        consultation_id: savedConsultation._id.toString(), // Store consultation ID for reference
        fullName,
        email,
      },
    });

    // Update the temp booking with the paymentSessionId
    savedConsultation.paymentSessionId = session.id;
    await savedConsultation.save();

    // Respond with the Stripe session URL
    res.status(200).send({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Error creating temporary consultation:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
