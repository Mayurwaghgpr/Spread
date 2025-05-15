import {Op } from "sequelize"
import User from "../models/user.js";
import Post from "../models/posts.js";
import formatPostData from "../utils/dataFormater.js";
import { deletePostImage } from "../utils/deleteImages.js";
import Likes from "../models/Likes.js";
import { fetchProfile } from "../utils/data-fetching.js";
import cloudinary from "../config/cloudinary.js";
import { deleteCloudinaryImage } from "../utils/cloudinaryDeleteImage.js";
import Comments from "../models/Comments.js";
import redisClient from "../utils/redisClient.js";
import { EXPIRATION } from "../config/constants.js";
import { CookieOptions } from "../utils/cookie-options.js";

// Get user profile
export const getUserProfile = async (req, res, next) => {
  const id = req?.params?.id;
  try {
    const cachedUserData = await redisClient.get(id);
    if (cachedUserData !== null) {
      console.log('cach hit')
      return res.status(200).json(JSON.parse(cachedUserData));
    }

    console.log('cach miss')

    const userInfo = await fetchProfile({id});
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
      where: { authorId: userId , createdAt: { [Op.lt]: lastTimestamp }},
      include: [
        {
          model: User,
          attributes: ["id", "username", "userImage","displayName"],
        },
        {
          model: Likes, // Include likes
          as: "Likes",
          required: false,
        },
         {
          model: Comments,
          as: "comments",
        }
      ],
      limit,
      order: [["createdAt", "DESC"]], // Optional: Order posts by creation date
    });

    if (posts.length > 0) {
      const postData = formatPostData(posts); // Format post data
      res.status(200).json(postData);
    } else {
      res.status(404).send("No posts found");
    }
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
    console.log('Error while get followings',error.message)
    next(error);
  }
};

// Edit user profile
export const EditUserProfile = async (req, res, next) => {
  const image = req.files ? req.files : [];
  const data = req.body;
  let updatedData = { ...data };
  try {
    // update new image path and delete the old image file from folder
    if (image.length > 0) {
      const result= await cloudinary.uploader.upload(image[0].path);
      updatedData.userImage = result.secure_url  // Update user image path
      updatedData.cloudinaryPubId = result.public_id;

      if (!data.userFromOAuth && data.cloudinaryPubId) {
        // console.log("old_pubId",data.cloudinaryPubId)
      if (!data.userFromOAuth&&data.cloudinaryPubId!==process.env.USER_IMAGE_OUTLOOK) {// Delete old image

       await deleteCloudinaryImage(data.cloudinaryPubId);
      }
        await deletePostImage(image);
      }
    }
    // To only remove image
    if (data.removeImage && data.userImage && data.userImage !== " ") {
      updatedData.userImage = ""; // Remove user image
      //If user is not loged in with OAuth i.e google/github etc. so he will have image stored in backend
      if (!data.userFromOAuth&&data.cloudinaryPubId!==process.env.USER_IMAGE_OUTLOOK) {
       await deleteCloudinaryImage(data.cloudinaryPubId);
      }
    }

    delete data.userFromOAuth;
    const [_, updatedUser] = await User.update(updatedData, {
      where: { id: req.authUser.id },
      attributes: { exclude: ["password"] },
      returning: true,
      plain: true,
    });

    if (updatedUser) {
      await redisClient.del(req.authUser.id)
      res
        .status(200)
        .cookie("_userDetail", JSON.stringify(updatedUser), CookieOptions)
        .json(updatedUser); // Return updated user info
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    next(err);
  }
};

export const searchForUsername = async (req, res, next) => {
  const username = req.body.username;
  try {
if (!username) {
    return res.status(400).json({message:"cannot set empty username,you should proved username"})
  }
  const exist = await User.findOne({ where: {username} });
  if (exist) {
    return res.status(409).json({message: 'username is already taken',exist})
  }
  res.status(200).json({username})
  } catch (error) {
    console.log('Error while searching username',error.message)
    next(error);
}
}