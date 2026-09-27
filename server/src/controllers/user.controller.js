import { Op } from "sequelize";
import User from "../models/user.model.js";
import Post from "../models/posts/posts.model.js";
import { deletePostImage } from "../utils/deleteImages.js";
import Likes from "../models/likes.model.js";
import cloudinary from "../config/cloudinary.js";
import { deleteCloudinaryImage } from "../utils/cloudinaryDeleteImage.js";
import Comments from "../models/comments.model.js";
import redisClient from "../utils/redisClient.js";
import { EXPIRATION } from "../config/constants.js";
import userService from "../services/user.service.js";
import { bloomFilter } from "../utils/BloomFilter.js";

// Get user profile (supports UUID or username)
export const getUserProfile = async (req, res, next) => {
  const rawId = req?.params?.id;
  try {
    if (!rawId) {
      return res.status(400).json({ message: "User identifier is required" });
    }
    const cleanId = rawId.replace(/^@/, "");

    const cachedUserData = await redisClient.get(cleanId);
    if (cachedUserData !== null) {
      return res.status(200).json(JSON.parse(cachedUserData));
    }

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        cleanId
      );
    const query = isUuid ? { id: cleanId } : { username: cleanId };

    const userInfo = await userService.finduser(query);
    if (!userInfo) {
      return res.status(404).json({ message: "User not found" });
    }

    await redisClient.setEx(cleanId, EXPIRATION, JSON.stringify(userInfo));
    return res.status(200).json(userInfo);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    next(error);
  }
};

// Get posts by user ID
export const getUserPostsById = async (req, res, next) => {
  const userId = req.params.userId;
  const limit = Math.max(parseInt(req.query.limit?.trim()) || 3, 1);
  const lastTimestamp = req.query.lastTimestamp || new Date().toISOString();

  try {
    const { count: totalPosts, rows: posts } = await Post.findAndCountAll({
      where: { authorId: userId, createdAt: { [Op.lt]: lastTimestamp } },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "userImage", "displayName"],
        },
        {
          model: Likes,
          as: "Likes",
          required: false,
        },
        {
          model: Comments,
          as: "comments",
        },
      ],
      limit,
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error while fetching user posts error:", error.message);
    next(error);
  }
};

// Get followers of the current user
export const getFollowers = async (req, res, next) => {
  const userId = req?.params?.userId || req.authUser?.id;
  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: User,
          as: "Followers",
          attributes: ["id", "username", "displayName", "userImage", "bio"],
          through: { attributes: [] },
        },
      ],
    });

    res.status(200).json(user?.Followers || []);
  } catch (error) {
    next(error);
  }
};

// Get users that the current user is following
export const getFollowing = async (req, res, next) => {
  const userId = req?.params?.userId || req.authUser?.id;

  try {
    const user = await User.findByPk(userId, {
      include: [
        {
          model: User,
          as: "Following",
          attributes: ["id", "username", "displayName", "userImage", "bio"],
          through: { attributes: [] },
        },
      ],
    });

    res.status(200).json(user?.Following || []);
  } catch (error) {
    console.log("Error while get followings", error.message);
    next(error);
  }
};

// Edit user profile
export const EditUserProfile = async (req, res, next) => {
  const image = req.files ? req.files : [];
  const data = req.body;
  const oldCloudinaryPubId = data.cloudinaryPubId;

  let updatedData = { ...data };

  try {
    if (image.length > 0) {
      const result = await cloudinary.uploader.upload(image[0].path);
      updatedData.userImage = result.secure_url;
      updatedData.cloudinaryPubId = result.public_id;

      if (
        !data.userFromOAuth &&
        oldCloudinaryPubId &&
        oldCloudinaryPubId !== process.env.USER_IMAGE_OUTLOOK
      ) {
        await deleteCloudinaryImage(oldCloudinaryPubId);
      }

      await deletePostImage(image);
    }

    if (data.removeImage && data.userImage && data.userImage.trim() !== "") {
      updatedData.userImage = "";
      updatedData.cloudinaryPubId = "";

      if (
        !data.userFromOAuth &&
        oldCloudinaryPubId &&
        oldCloudinaryPubId !== process.env.USER_IMAGE_OUTLOOK
      ) {
        await deleteCloudinaryImage(oldCloudinaryPubId);
      }
    }

    delete updatedData.userFromOAuth;

    // Safely parse JSON fields if provided via FormData
    const jsonFields = ["interests", "skills", "socialLinks", "profilePreferences", "aiProfileSummary"];
    for (const field of jsonFields) {
      if (typeof updatedData[field] === "string") {
        try {
          updatedData[field] = JSON.parse(updatedData[field]);
        } catch (e) {
          // keep as is if not parseable
        }
      }
    }

    // Track username changes in Bloom Filter
    if (updatedData.username) {
      bloomFilter.add(updatedData.username);
    }

    const [_, updatedUser] = await User.update(updatedData, {
      where: { id: req.authUser.id },
      returning: true,
      plain: true,
    });

    if (updatedUser) {
      const fullUser = await userService.finduser({ id: req.authUser.id });
      const payload = fullUser || updatedUser;
      await redisClient.setEx(
        req.authUser.id,
        EXPIRATION,
        JSON.stringify(payload)
      );
      if (payload.username) {
        await redisClient.setEx(
          payload.username,
          EXPIRATION,
          JSON.stringify(payload)
        );
      }
      res.status(200).json(payload);
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    next(err);
  }
};

// Update Spread About Canvas
export const updateAboutCanvas = async (req, res, next) => {
  const userId = req.authUser?.id;
  const {
    currentFocus,
    aboutStory,
    interests,
    skills,
    socialLinks,
    pinnedPostId,
    profilePreferences,
    aiProfileSummary,
  } = req.body;

  try {
    const updatePayload = {};
    if (currentFocus !== undefined) updatePayload.currentFocus = currentFocus;
    if (aboutStory !== undefined) updatePayload.aboutStory = aboutStory;
    if (interests !== undefined) updatePayload.interests = Array.isArray(interests) ? interests : [];
    if (skills !== undefined) updatePayload.skills = Array.isArray(skills) ? skills : [];
    if (socialLinks !== undefined) updatePayload.socialLinks = typeof socialLinks === "object" ? socialLinks : {};
    if (pinnedPostId !== undefined) updatePayload.pinnedPostId = pinnedPostId || null;
    if (profilePreferences !== undefined) updatePayload.profilePreferences = profilePreferences;
    if (aiProfileSummary !== undefined) updatePayload.aiProfileSummary = aiProfileSummary;

    await User.update(updatePayload, { where: { id: userId } });

    const freshUser = await userService.finduser({ id: userId });
    if (freshUser) {
      await redisClient.setEx(userId, EXPIRATION, JSON.stringify(freshUser));
      if (freshUser.username) {
        await redisClient.setEx(freshUser.username, EXPIRATION, JSON.stringify(freshUser));
      }
      return res.status(200).json(freshUser);
    }

    res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error("Error updating About canvas:", error);
    next(error);
  }
};

// Pin or Unpin a story for the profile
export const pinUserPost = async (req, res, next) => {
  const userId = req.authUser?.id;
  const { postId } = req.body;

  try {
    if (postId) {
      const post = await Post.findOne({ where: { id: postId, authorId: userId } });
      if (!post) {
        return res.status(404).json({ message: "Story not found or unauthorized to pin" });
      }
    }

    await User.update({ pinnedPostId: postId || null }, { where: { id: userId } });

    const freshUser = await userService.finduser({ id: userId });
    if (freshUser) {
      await redisClient.setEx(userId, EXPIRATION, JSON.stringify(freshUser));
      if (freshUser.username) {
        await redisClient.setEx(freshUser.username, EXPIRATION, JSON.stringify(freshUser));
      }
      return res.status(200).json(freshUser);
    }

    res.status(400).json({ message: "Could not update pinned story" });
  } catch (error) {
    console.error("Error pinning story:", error);
    next(error);
  }
};

// Sub-millisecond O(1) Bloom Filter backed username search
export const searchForUsername = async (req, res, next) => {
  const rawUsername = req.body.username;
  const username = typeof rawUsername === "string" ? rawUsername.toLowerCase().trim() : "";

  try {
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Step 1: O(1) Bloom Filter Check
    // If Bloom Filter says false, the username definitely DOES NOT exist!
    if (!bloomFilter.contains(username)) {
      return res.status(200).json({ username, available: true, fastCheck: true });
    }

    // Step 2: If Bloom Filter says true (might exist), query PostgreSQL to verify
    const exist = await User.findOne({ where: { username } });
    if (exist) {
      return res
        .status(409)
        .json({ message: "Username is already taken", exist: true });
    }

    res.status(200).json({ username, available: true });
  } catch (error) {
    console.error("Error while searching username:", error.message);
    next(error);
  }
};
