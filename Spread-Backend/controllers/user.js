import { Sequelize, Op } from "sequelize";
// import Redis from "redis";
import User from "../models/user.js";
import Post from "../models/posts.js";
import formatPostData from "../utils/dataFormater.js";
import { deletePostImage } from "../utils/deleteImages.js";
import Likes from "../models/Likes.js";
import { DataFetching } from "../operations/data-fetching.js";
// import redisClient from "../utils/redisClient.js";

const EXPIRATION = 3600;
const dataFecter = new DataFetching();

export const getLoginUser = async (req, res, nex) => {
  const userInfo = req.cookies._userDetail;
  res.status(200).json(userInfo);
};
// Get user profile
export const getUserProfile = async (req, res, next) => {
  const id = req?.params?.id || req.authUser.id;

  try {
    // const cachedUserData = await redisClient.get(id);
    // if (cachedUserData !== null) {
    //   console.log('cach hit')
    //   return res.status(200).json(JSON.parse(cachedUserData));
    // }
    // console.log('cach miss')

    const userInfo = await dataFecter.Profile(id);
    // console.log("dsds",userInfo)

    if (userInfo) {
      // await redisClient.setEx(id, EXPIRATION, JSON.stringify(userInfo));
      return res.status(200).json(userInfo);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    // return res.status(500).json({ message: 'An error occurred while fetching user profile' });
    next(error);
  }
};

// Get posts by user ID
export const getUserPostsById = async (req, res, next) => {
  const userId = req.params.userId;
  const limit = Math.max(parseInt(req.query.limit?.trim()) || 3, 1);
  const page = Math.max(parseInt(req.query.page?.trim()) || 1, 1);
  // console.log("getUserPostsById...")
  try {
    const { count: totalPosts, rows: posts } = await Post.findAndCountAll({
      where: { authorId: userId },
      include: [
        {
          model: User,
          attributes: ["id", "username", "userImage"],
        },
        {
          model: Likes, // Include likes
          as: "Likes",
          required: false,
        },
        
      ],
      limit,
      offset: (page - 1) * limit,
      order: [["createdAt", "DESC"]], // Optional: Order posts by creation date
    });

    if (posts.length > 0) {
      const postData = formatPostData(posts); // Format post data
      res.status(200).json({
        posts: postData,
        meta: {
          currentPage: page,
          totalPages: Math.ceil(totalPosts / limit),
          hasNextPage: page < Math.ceil(totalPosts / limit),
          totalPosts,
        },
      });
    } else {
      res.status(404).send("No posts found");
    }
  } catch (error) {
    console.error("Server error:", error);
    // res.status(500).send('Server error');
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
    // res.status(400).json({ error: error.message });
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
      updatedData.userImage = "images/userImages/" + image[0].filename; // Update user image path
      if (data.userFromOAuth === false && data.userImage) {
        await deletePostImage([data.userImage]); // Delete old image
      }
    }
    // To only remove image
    if (data.removeImage && data.userImage && data.userImage !== " ") {
      updatedData.userImage = ""; // Remove user image
      //If user is not loged in with OAuth i.e google/github etc. so he will have image stored in backend
      if (data.userFromOAuth === false) {
        await deletePostImage([data.userImage]);
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
      res
        .status(200)
        .cookie("_userDetail", updatedUser, { httpOnly: true })
        .json(updatedUser); // Return updated user info
    } else {
      res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error updating profile:", err);
    // res.status(500).json({ message: "Internal server error" });
    next(err);
  }
};
