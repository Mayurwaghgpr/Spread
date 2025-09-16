import { Op } from "sequelize";
import User from "../models/user.model.js";
import Post from "../models/posts.model.js";
import { deletePostImage } from "../utils/deleteImages.js";
import Likes from "../models/likes.model.js";
import { fetchProfile } from "../utils/data-fetching.js";
import cloudinary from "../config/cloudinary.js";
import { deleteCloudinaryImage } from "../utils/cloudinaryDeleteImage.js";
import Comments from "../models/comments.model.js";
import redisClient from "../utils/redisClient.js";
import { EXPIRATION } from "../config/constants.js";
import { CookieOptions } from "../utils/cookie-options.js";

// Get user profile
export const getUserProfile = async (req, res, next) => {
  const id = req?.params?.id;
  try {
    const cachedUserData = await redisClient.get(id);
    if (cachedUserData !== null) {
      console.log("cach hit");
      return res.status(200).json(JSON.parse(cachedUserData));
    }

    console.log("cach miss");

    const userInfo = await fetchProfile({ id });
    // console.log("dsds",userInfo)

    if (userInfo) {
      await redisClient.setEx(id, EXPIRATION, JSON.stringify(userInfo));
      return res.status(200).json(userInfo);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
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

  // console.log("getUserPostsById...")
  try {
    const { count: totalPosts, rows: posts } = await Post.findAndCountAll({
      where: { authorId: userId, createdAt: { [Op.lt]: lastTimestamp } },
      include: [
        {
          model: User,
          attributes: ["id", "username", "userImage", "displayName"],
        },
        {
          model: Likes, // Include likes
          as: "Likes",
          required: false,
        },
        {
          model: Comments,
          as: "comments",
        },
      ],
      limit,
      order: [["createdAt", "DESC"]], // Optional: Order posts by creation date
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error while fetching user posts error:", error.message);
    next(error);
  }
};

// Get followers of the current user
export const getFollowers = async (req, res, next) => {
  const userId = req?.params?.userId || req.authUser.id;
  try {
    const user = await User.findByPk(userId, {
      include: [{ model: User, as: "Followers" }],
    });

    res.status(200).json(user.Followers);
  } catch (error) {
    // res.status(400).json({ error: error.message });
    next(error);
  }
};

// Get users that the current user is following
export const getFollowing = async (req, res, next) => {
  const userId = req?.params?.userId || req.authUser.id;

  try {
    const user = await User.findByPk(userId, {
      include: [{ model: User, as: "Following" }],
    });

    res.status(200).json(user.Following);
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
    // If new image uploaded
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

    // If image needs to be removed
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

    const [_, updatedUser] = await User.update(updatedData, {
      where: { id: req.authUser.id },
      returning: true,
      plain: true,
    });

    if (updatedUser) {
      await redisClient.setEx(
        req.authUser.id,
        EXPIRATION,
        JSON.stringify(updatedUser)
      );
      res.status(200).json(updatedUser);
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    next(err);
  }
};

// Check if user name already exist
export const searchForUsername = async (req, res, next) => {
  const username = req.body.username;
  try {
    if (!username) {
      return res
        .status(400)
        .json({ message: "cannot set empty username,please provied username" });
    }
    const exist = await User.findOne({ where: { username } });
    if (exist) {
      return res
        .status(409)
        .json({ message: "username is already taken", exist });
    }
    res.status(200).json({ username });
  } catch (error) {
    console.log("Error while searching username", error.message);
    next(error);
  }
};
