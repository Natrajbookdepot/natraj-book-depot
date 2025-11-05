// backend/utils/cloudinary.js
const cloudinary        = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer            = require("multer");

/* 1. configure the SDK (needed by *every* script) */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* 2. set up multer storage (used only in your Express routes) */
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "natraj-book-depot",
    allowed_formats: ["jpg","jpeg","png","webp","gif","pdf","doc","docx","mp4","mp3","txt"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});
const upload = multer({ storage });

/* 3. export BOTH the raw SDK and the multer wrapper */
module.exports = {
  cloudinary,   // gives access to cloudinary.uploader.upload(...)
  upload,       // lets your routes accept multipart/form-data
};
