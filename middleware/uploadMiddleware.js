import multer from "multer";
import CloudinaryStorage from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

// multer-storage-cloudinary v2.x expects the cloudinary object to have a .v2 property
const cloudinaryConfig = cloudinary.v2 ? cloudinary : { v2: cloudinary };

const storage = CloudinaryStorage({
  cloudinary: cloudinaryConfig,
  folder: "social_posts",
  allowedFormats: ["jpg", "png", "jpeg"],
});

const upload = multer({ storage });

export default upload;
