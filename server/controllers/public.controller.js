import sequelize, { Op } from "sequelize";
import User from "../models/user.js";
import Post from "../models/posts.js";
import Follow from "../models/Follow.js";
import Archive from "../models/Archive.js";
import Likes from "../models/Likes.js";
import redisClient from "../utils/redisClient.js";
import { EXPIRATION } from "../config/constants.js";
import { startedFollowing } from "../services/notifications/follows.worker.js";
// Fetch all users except the current user and distinct topics
export const getHomeContent = async (req, res, next) => {
  try {
    // Fetch users excluding the current user
    const userSuggetion = await User.findAll({
      where: { id: { [Op.ne]: req.authUser.id } },
      include: [
        {
          model: User,
          as: "Followers",
          through: { attributes: [] }, // Exclude through table attributes
          attributes: ["id"], // Fetch only necessary fields
        },
        {
          model: User,
          as: "Following",
          through: { attributes: [] }, // Exclude through table attributes
          attributes: ["id"], // Fetch only necessary fields
        },
      ],

      attributes: [
        "id",
        "username",
        "userImage",
        "bio",
        "displayName",
        "createdAt",
      ],
      order: [[sequelize.fn("RANDOM")]], // Random order
      limit: 4,
    });

    // Fetch distinct topics
    const topics = await Post.findAll({
      attributes: [[sequelize.fn("DISTINCT", sequelize.col("topic")), "topic"]],
      order: [["topic", "ASC"]],
      limit: 7,
    });

    res.status(200).json({ topics, userSuggetion });
  } catch (error) {
    console.error("Error fetching home data:", error);
    next(error);
  }
};
export const getPeoples = async (req, res, next) => {
  const limit = Math.max(parseInt(req.query.limit?.trim()) || 10, 1);
  const lastTimestamp = req.query.lastTimestamp || new Date().toISOString();
  const currentUserId = req.authUser.id;
  const searchQuery = req.query.q || "";
  console.log("peoples");
  try {
    // const cacheKey = `find_peoples_${currentUserId}_${searchQuery}_${lastTimestamp}_${limit}`;

    // // Unique cache key for this combination
    // // Checking Cache
    // const cachedPostData = await redisClient.get(cacheKey);
    // if (cachedPostData !== null) {
    //   console.log('cach hit')
    //   return res.status(200).json({peoples:JSON.parse(cachedPostData)}); // Send cached data
    // }
    // console.log('cach miss')

    const peoples = await User.findAll({
      include: [
        {
          model: User,
          as: "Followers",
          through: { attributes: [] },
          attributes: ["id"],
        },
        {
          model: User,
          as: "Following",
          through: { attributes: [] },
          attributes: ["id"],
        },
      ],
      attributes: ["id", "displayName", "username", "userImage", "createdAt"],
      where: {
        username: {
          [Op.or]: [
            { [Op.iLike]: `${searchQuery}%` },
            { [Op.iLike]: `%${searchQuery}%` },
            { [Op.iLike]: `${searchQuery}` },
          ],
        },
        createdAt: { [Op.lt]: lastTimestamp },
      },
      order: [["createdAt", "DESC"]], // IMPORTANT
      limit,
    });
    // await redisClient.setEx(cacheKey,EXPIRATION,JSON.stringify(peoples))
    res.status(200).json({ peoples });
  } catch (error) {
    console.error("Error fetching peoples data:", error);
    next(error);
  }
};
// Search for posts based on a query string
export const searchData = async (req, res, next) => {
  const searchQuery = req.query.q;

  try {
    const cachedSearchData = await redisClient.get(searchQuery);
    if (cachedSearchData !== null) {
      console.log("cach hit");
      return res
        .status(200)
        .json({ key: searchQuery, data: JSON.parse(cachedSearchData) }); // Send cached data
    }
    const searchResult = await Post.findAll({
      where: {
        [Op.or]: [
          {
            topic: {
              [Op.or]: [
                { [Op.like]: `${searchQuery}%` },
                { [Op.like]: `%${searchQuery}%` },
                { [Op.like]: `${searchQuery}` },
              ],
            },
          },
          {
            title: {
              [Op.or]: [
                { [Op.like]: `${searchQuery}%` },
                { [Op.like]: `%${searchQuery}%` },
                { [Op.like]: `${searchQuery}` },
              ],
            },
          },
        ],
      },
      // attributes: [],
      limit: 10,
    });
    if (searchResult.length > 0) {
      await redisClient.setEx(
        searchQuery,
        EXPIRATION,
        JSON.stringify(searchResult)
      );
    }
    res.status(200).json({ key: searchQuery, data: searchResult });
  } catch (error) {
    console.error("Error searching data:", error);
    next(error);
  }
};

export const getAllUser = async (req, res, next) => {
  const limit = Math.max(parseInt(req.query.limit?.trim()) || 5, 1);
  const lastTimestamp = req.query.lastTimestamp || new Date().toISOString();
  const currentUserId = req.authUser.id;
  try {
    const cacheKey = `Users_Data_${lastTimestamp}__${limit}`;
    // Unique cache key for this combination
    // Checking Cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData !== null) {
      console.log("cach hit");
      return res.status(200).json(JSON.parse(cachedData)); // Send cached data
    }
    const users = await User.findAll({
      where: {
        id: { [Op.ne]: currentUserId },
        createdAt: { [Op.lt]: lastTimestamp },
      },
      attributes: ["id", "displayName", "username", "userImage"],
      order: [["createdAt", "ASC"]],
      limit,
    });
    await redisClient.setEx(cacheKey, EXPIRATION, JSON.stringify(users));
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users data:", error);
    next(error);
  }
};

export const LikePost = async (req, res, next) => {
  const { postId, liketype: type } = req.body;
  const { id: likedBy } = req.authUser;

  try {
    if (!postId) {
      return res.status(400).json({ message: "postId is required" });
    }
    const cachedData = JSON.parse(await redisClient.get(postId));
    console.log({ cachedData });
    // Check if the like already exists
    const existingLike = await Likes.findOne({ where: { likedBy, postId } });

    if (existingLike) {
      if (!type) {
        await existingLike.destroy();
      } else {
        await existingLike.update({ type });
      }
    } else {
      await Likes.create({ likedBy, postId, type });
    }

    // Send response
    res.status(201).json({
      message: existingLike
        ? type
          ? "like updated"
          : "removed like"
        : "added like",
    });
  } catch (error) {
    next(error);
  }
};

// Follow/unfollow a user
export const FollowUser = async (req, res, next) => {
  const { followerId, followedId } = req.body;

  try {
    // Prevent users from following themselves
    if (followerId === followedId) {
      return res
        .status(400)
        .json({ status: "error", message: "You cannot follow yourself" });
    }

    let userInfo;
    userInfo = JSON.parse(await redisClient.get(followerId));

    // console.log({ userInfo });
    // Check if the follow relationship already exists
    const existingFollow = await Follow.findOne({
      where: { followerId, followedId },
    });

    if (existingFollow) {
      // Unfollow user
      await existingFollow.destroy();
      userInfo.Following = userInfo?.Following
        ? userInfo?.Following?.filter((follow) => follow.id !== followedId)
        : [];
    } else {
      // Follow user
      await Follow.create({ followerId, followedId });
      userInfo.Following = [...userInfo?.Following, { id: followedId }];
      // console.log({ followedId, followerId });
      startedFollowing(followedId, followerId);
    }
    await redisClient.setEx(followerId, EXPIRATION, JSON.stringify(userInfo));
    res.status(201).json({
      status: "success",
      message: existingFollow
        ? "Unfollowed successfully"
        : "Followed successfully",
    });
  } catch (error) {
    console.error("Error in FollowUser:", error);
    next(error);
  }
};

// Add a post to the user's archive
export const AddPostToArchive = async (req, res, next) => {
  const { postId } = req.body;
  const userId = req.authUser.id;

  const userInfo = JSON.parse(await redisClient.get(userId));
  try {
    let updatedUserInfo;
    let message;
    const exist = await Archive.findOne({ where: { postId, userId } });
    if (exist) {
      const filterSavedPost = userInfo?.savedPosts?.filter(
        (post) => post.id !== postId
      );
      if (Array.isArray(filterSavedPost)) {
        updatedUserInfo = { ...userInfo, savedPosts: filterSavedPost };
      }
      await exist.destroy();
      message = "Removed from archive";
    } else {
      await Archive.create({ postId, userId });
      updatedUserInfo = {
        ...userInfo,
        savedPosts: [...userInfo.savedPosts, { id: postId }],
      };
      message = "Post archived successfully";
    }
    await redisClient.setEx(userId, 3600, JSON.stringify(updatedUserInfo));
    res.status(200).json({
      message,
      archived: updatedUserInfo.savedPosts,
    });
  } catch (error) {
    console.error("Error archiving post:", error);
    next(error);
  }
};
