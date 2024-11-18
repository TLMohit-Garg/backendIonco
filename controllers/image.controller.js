// controllers/imageController.js
import multer from 'multer';
import cloudinary from '../config/cloudinary.js';
import Image from '../models/image.model.js';
import path from 'path';

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Temp directory for storing files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage }).single('image'); // single field 'image'

export const uploadImage = (req, res) => {
  // Handle Multer image upload first
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).send({ message: 'Error uploading file' });
    }

    // After file is uploaded to the local server, upload it to Cloudinary
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'images', // Cloudinary folder for organization
      });

      // Save image URL in the database
      const newImage = new Image({
        imageUrl: result.secure_url, // Cloudinary URL
      });

      await newImage.save(); // Save the image record in the database

      res.status(200).send({
        message: 'Image uploaded successfully!',
        imageUrl: result.secure_url, // Send back the Cloudinary URL
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error saving image to Cloudinary' });
    }
  });
};
