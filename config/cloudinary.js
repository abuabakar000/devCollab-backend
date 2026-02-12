import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Verify connection
cloudinary.api.ping()
  .then(() => console.log("✅ Cloudinary Connected Successfully"))
  .catch((err) => console.error("❌ Cloudinary Connection Failed:", err.message));

export { cloudinary };
export default cloudinary;
