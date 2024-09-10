import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import productRoutes from "./routes/product.route.js";
import patientSignupRoutes from "./routes/patientSignup.route.js";
import doctorSignupRoutes from "./routes/doctorSignup.route.js";
import patientSigninRoutes from "./routes/patientSingin.route.js";
import doctorSigninRoutes from "./routes/doctorSignin.route.js";
import consultationRoutes from "./routes/consultation.route.js";
import { authenticateToken } from "./middleware/authMiddleware.js";
// import dotenv from "dotenv";

// dotenv.config();
console.log('PORT:', process.env.PORT);
console.log('DB_URI:', process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());   //middleware configurations. 


// const JWT_SECRET = process.env.JWT_SECRET 
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://tlwebcodeft:OxN5ziFfVeNrJvTB@cluster0.mlobm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// const JWT_SECRET = "931079ede9061896e77a0516ba2351c0a6680fa90e117cc3b3e355b7c12c7efc1893159a2ef2e0c4811e785bb69ee262b40c0686ed185eb6d49a293701c99049";

//routes
app.use("/api/products", productRoutes);
app.use("/api/patientSignup", patientSignupRoutes);
app.use("/api/patientSignin",patientSigninRoutes);
app.use("/api/doctorSignup",doctorSignupRoutes);
app.use("/api/doctorSignin",doctorSigninRoutes);
app.use("/api/bookingConsultation",consultationRoutes);

app.use("/uploads", express.static("uploads"));

app.get("/", function (req, res) {
  res.send("Hello from Node server");
});

// app.post('/api/uploadImages', upload.array('images', 10), (req, res) => {
//   const images = req.files.map(file => ({
//     filename: file.filename,
//     url: `http://localhost:3000/uploads/${file.filename}`,
//   }));

//   res.json({ images });
// });

// Protected route example
app.get('/api/protectedRoute', authenticateToken, (req, res) => {
  res.status(200).json({ message: 'You have access to this protected route!', userId: req.userId });
});

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("Connected! to the database");
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })

  .catch(() => {
    console.log("Connection Failed!");
  });
