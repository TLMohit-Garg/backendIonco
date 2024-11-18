// models/Image.js
import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true }, // URL of the uploaded image
}, { timestamps: true });

const Image = mongoose.model('Image', imageSchema);

export default Image;
