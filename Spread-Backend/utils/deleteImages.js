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

export const deletePostImage = async (imageUrls) => {
  try {
    const deletePromises = imageUrls.map(async (url) => {
      const filePath = url
      
      // Check if the file exists before attempting to delete
      const exists = await fileExists(filePath);
      if (exists) {
        await fs.unlink(filePath); // Delete the file if it exists
      }
    });

    // Wait for all promises to resolve
    await Promise.all(deletePromises);

    return "All image files processed (deleted if they existed)";
  } catch (err) {
    return `Error processing image files: ${err.message}`;
  }
};
