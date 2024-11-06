import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import productRoutes from "./routes/product.route.js";
import patientSignupRoutes from "./routes/patientSignup.route.js";
import doctorSignupRoutes from "./routes/doctorSignup.route.js";
import patientSigninRoutes from "./routes/patientSingin.route.js";
import doctorSigninRoutes from "./routes/doctorSignin.route.js";
import consultationRoutes from "./routes/consultation.route.js";
import doctorBankingDetailRoutes from "./routes/doctorBankingDetail.route.js";
import adminSigninRouter from "./routes/adminSignin.route.js";
import userRoutes from "./routes/user.route.js";
import videoCallDetailRoutes from "./routes/videocallDetail.route.js";
// import { generateVideoCallLink } from './controllers/videoCalldetails.controller.js';
import { authenticateToken } from "./middleware/authMiddleware.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { Stripe } from "stripe";
import stripe from "./routes/stripe.route.js";

dotenv.config();
console.log("PORT:", process.env.PORT);
console.log("DB_URI:", process.env.MONGO_URI);
// const stripe = new Stripe('sk_test_51PyXQuRpCokjQ3HxyQEk2GFRhF3CeF3afcE9YBl4AIjWS1QoeEPh3B4yKsZ02kMbASNdq9S6pCRzCMRwvYFtQCTD00VuPY3rL1');

const app = express();

app.use(
  cors({
    origin: "https://teleconsultation.ioncosolutions.com",
  })
);
app.use(express.json()); //middleware configurations.

// const JWT_SECRET = process.env.JWT_SECRET
const port = process.env.PORT;
console.log("PORT:", process.env.PORT);
const MONGO_URI = process.env.MONGO_URI;
console.log("MONGO_URI:", process.env.MONGO_URI);
// const MONGO_URI = process.env.MONGO_URI || ""
// const JWT_SECRET = "931079ede9061896e77a0516ba2351c0a6680fa90e117cc3b3e355b7c12c7efc1893159a2ef2e0c4811e785bb69ee262b40c0686ed185eb6d49a293701c99049";

//routes
app.use("/api/admin-Signin", adminSigninRouter);
app.use("/api/products", productRoutes);
app.use("/api/patientSignup", patientSignupRoutes);
app.use("/api/patientSignin", patientSigninRoutes);
app.use("/api/doctorSignup", doctorSignupRoutes);
app.use("/api/doctorSignin", doctorSigninRoutes);
app.use("/api/bookingConsultation", consultationRoutes);
app.use("/api/doctorBankingDetail", doctorBankingDetailRoutes);
app.use("/api/stripe", stripe);
app.use("/api/users", userRoutes);
app.use("/api/videoCallDetail", videoCallDetailRoutes);

app.use("/uploads", express.static("uploads"));

app.get("/", function (req, res) {
  res.send("Hello from Node server");
});
// videoCallDetailRoutes.post('/generateVideoCallLink', generateVideoCallLink);

// app.post("/api/paymentBookingConsultation",async (req, res) => {
//   const { amount, currency } = req.body;
//   const idempontencyKey = uuidv4()

//   try {
//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: amount * 100, // Stripe expects the amount in the smallest currency unit (e.g., cents)
//     currency: currency,    // Example: 'usd'
//   });
//   res.send({
//     clientSecret: paymentIntent.client_secret,
//   });

// }catch (error) {
//     res.status(500).send({ error: error.message });
//   }
// });

// app.post('/api/uploadImages', upload.array('images', 10), (req, res) => {
//   const images = req.files.map(file => ({
//     filename: file.filename,
//     url: `http://localhost:3000/uploads/${file.filename}`,
//   }));

//   res.json({ images });
// });

// Protected route example
app.get("/api/protectedRoute", authenticateToken, (req, res) => {
  res.status(200).json({
    message: "You have access to this protected route!",
    userId: req.user.userId,
  });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected! to the database");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })

  .catch(() => {
    console.log("Connection Failed!");
  });
