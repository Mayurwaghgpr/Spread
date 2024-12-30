import cloudinary from "../config/cloudinary.js"; // Import Cloudinary configuration

// Function to delete an image
export const deleteCloudinaryImage = async (public_id) => {
return await cloudinary.api.delete_resources(public_id);
   
};
