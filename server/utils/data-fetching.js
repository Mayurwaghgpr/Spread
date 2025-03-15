import User from '../models/user.js'
import Post from "../models/posts.js"; // Ensure Post is imported
import { Op } from 'sequelize';

export const fetchProfile = async (...args) => {
    try {
      // Validate the input
      if (!args) throw new Error("User ID is required");
      // Fetch user profile information
      const userInfo = await User.findOne({
        where: {[Op.and]:[...args]},
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
            as: 'posts',
            attributes: ['id'],
          },
          {
            model: Post,
            as: 'savedPosts',
            through: { attributes: [] }, // Fetch only related posts
            attributes: ['id']
          },
        ],
      });

      // Check if user exists
      if (!userInfo) return false;

      return userInfo;
    } catch (error) {
      console.error("Error fetching user profile:", error.message);
      throw new Error("Failed to fetch user profile");
    }
  }

