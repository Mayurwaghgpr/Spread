import User from '../models/user.js'
import Post from "../models/posts.js"; // Ensure Post is imported

export class DataFetching {

  async Profile(id) {
      console.log("first...")
    try {
      // Validate the input
      if (!id) throw new Error("User ID is required");

      // Fetch user profile information
      const userInfo = await User.findOne({
        where: { id },
        attributes: { exclude: ['password'] },
        include: [
          {
            model: User,
            as: 'Followers',
            through: { attributes: [] }, // Exclude through table attributes
            attributes: ['id'], // Fetch only necessary fields
          },
          {
            model: User,
            as: 'Following',
            through: { attributes: [] }, // Exclude through table attributes
            attributes: ['id'], // Fetch only necessary fields
          },
          {
            model: Post,
            as: 'SavedPosts',
            through: { attributes: [] }, // Fetch only related posts
          },
        ],
      });

      // Check if user exists
      if (!userInfo) throw new Error("User not found");

      return userInfo;
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
      throw new Error("Failed to fetch user profile");
    }
  }
}
