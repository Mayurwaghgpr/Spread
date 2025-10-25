import cloudinary from "../config/cloudinary.js";

class Cloudinary {
  async deleteImages(publicIds) {
    try {
      const deletePromises = publicIds.map((publicId) => {
        return cloudinary.uploader.destroy(publicId, {
          resource_type: "image",
        });
      });
      const results = await Promise.all(deletePromises);
      return results;
    } catch (error) {
      throw new Error("Failed to delete images from Cloudinary");
    }
  }
}

export default new Cloudinary();
