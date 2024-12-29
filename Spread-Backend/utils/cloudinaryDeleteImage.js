import cloudinary from "../config/cloudinary.js"; // Import Cloudinary configuration

// Function to delete an image
export const deleteCloudinaryImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok") {
      console.log("Image deleted successfully");
    } else {
      console.error("Failed to delete image:", result);
    }
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};
