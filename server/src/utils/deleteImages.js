import fs from "fs/promises";
import path from "path";

// Helper function to check if the file exists
const fileExists = async (filePath) => {
  try {
    await fs.access(filePath);
    return true; // File exists
  } catch (err) {
    return false; // File does not exist
  }
};

export const deletePostImage = async (imagePaths) => {
  try {
    const deletePromises = imagePaths.map(async (image) => {
      const imagePath = image.path
      
      // Check if the file exists before attempting to delete
      const exists = await fileExists(imagePath);
      if (exists) {
        await fs.unlink(imagePath); // Delete the file if it exists
      }
    });

    // Wait for all promises to resolve
    await Promise.all(deletePromises);

    return "All image files processed (deleted if they existed)";
  } catch (err) {
    return `Error processing image files: ${err.message}`;
  }
};
