import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "portfolio-projects",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

// Separate uploader for resumes/CVs (PDF, DOC, DOCX) — needs resource_type "raw"
const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: async (req, file) => {
    const originalName = file.originalname.replace(/\.[^/.]+$/, ""); // strip extension
    return {
      folder: "portfolio-resume",
      resource_type: "raw",
      public_id: originalName,
      allowed_formats: ["pdf", "doc", "docx"],
    };
  },
});

export const uploadResume = multer({ storage: resumeStorage });

export default upload;