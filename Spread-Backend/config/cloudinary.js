import { v2 as cloudinary } from "cloudinary";
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINERY_CLOUD_NAME,
  api_key: process.env.CLOUDINERY_API_KEY,
  api_secret: process.env.CLOUDINERY_SECRETE_KEY, // Click 'View API Keys' above to copy your API secret
});

export default cloudinary;