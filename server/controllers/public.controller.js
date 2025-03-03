import sequelize, { Op, Sequelize, where } from "sequelize";
import User from "../models/user.js";
import Post from "../models/posts.js";
import Follow from "../models/Follow.js";
import Archive from "../models/Archive.js";
import Likes from "../models/Likes.js";
import { DataFetching } from "../operations/data-fetching.js";
import { CookieOptions } from "../utils/cookie-options.js";
import redisClient from "../utils/redisClient.js";
import { EXPIRATION } from "../config/constants.js";
const dataFetcher = new DataFetching();

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

      attributes: ["id", "username", "userImage", "bio"],
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
    console.error("Error fetching utility data:", error);
    next(error);
  }
};

// Search for posts based on a query string
export const searchData = async (req, res, next) => {
  const searchQuery = req.query.q;

  try {
       const cachedSearchData = await redisClient.get(searchQuery);
    if (cachedSearchData !== null) {
      console.log('cach hit')
      return res.status(200).json({key:searchQuery,data:JSON.parse(cachedSearchData)});// Send cached data
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
    if(searchResult.length>0){await redisClient.setEx(searchQuery,EXPIRATION,JSON.stringify(searchResult))}
    res.status(200).json({key:searchQuery,data:searchResult});
  } catch (error) {
    console.error("Error searching data:", error);
    next(error);
  }
};

export const getAllUser = async (req,res,next) => {
  const limit = Math.max(parseInt(req.query.limit?.trim()) || 5, 1);
  const lastTimestamp = req.query.lastTimestamp || new Date().toISOString();
  const currentUserId = req.authUser.id;
  console.log(limit)
  try {
    const cacheKey = `Users_Data_${lastTimestamp}__${limit}`;
    // Unique cache key for this combination
    // Checking Cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData !== null) {
      console.log('cach hit')
      return res.status(200).json(JSON.parse(cachedData));// Send cached data
    }
    const users = await User.findAll({
      where: {
        id: { [Op.ne]: currentUserId },
        createdAt: { [Op.lt]: lastTimestamp }
      },
      attributes: ['id', 'displayName', 'username', 'userImage'],
      order: [
        ["createdAt", "ASC"],
      ],
      limit, 
    })
    await redisClient.setEx(cacheKey,EXPIRATION,JSON.stringify(users))
    res.status(200).json(users)
  } catch (error) {
    console.error("Error fetching users data:", error);
    next(error);
  }
  
}

export const LikePost = async (req, res, next) => {
  const { postId, liketype: type } = req.body;
  const { id: likedBy } = req.authUser;

  try {
    // Check if the like already exists
    const existingLike = await Likes.findOne({ where: { likedBy, postId } });

    if (existingLike) {
      !type ?
        // If type is not provided, remove the like
        await existingLike.destroy() :
        // If type is provided, update the like type
        await existingLike.update({ type });

    } else {
      // If the like doesn't exist, create a new one
      await Likes.create({ likedBy, postId, type });
    }

    // Fetch updated likes for the post
    const updatedLikes = await Likes.findAll({ where: { postId } });

    // Send response
    res.status(201).json({
      message: existingLike ? (type ? "like updated" : "removed like") : "added like",
      updatedLikes,
    });
  } catch (error) {
    next(error);
  }
};

// Follow/unfollow a user
export const FollowUser = async (req, res, next) => {
  const { followerId, followedId } = req.body;


  try {
    let userInfo = JSON.parse(req.cookies._userDetail);
      // Prevent users from following themselves
  if (followerId === followedId) {
    return res
      .status(400)
      .json({ status: "error", message: "You cannot follow yourself" });
  }


    // Check if the follow relationship already exists
    const existingFollow = await Follow.findOne({
      where: { followerId, followedId },
    });

    if (existingFollow) {
        userInfo.Following = userInfo.Following.filter((follow) => follow.id !== followedId);
      // Unfollow user
      await existingFollow.destroy();
      // console.log(userInfo);
    } else {
      // Follow user
      await Follow.create({ followerId, followedId });
      // console.log(userInfo);
       userInfo.Following.push({id:followedId})
    }
      res
        .status(201)
        .cookie("_userDetail",  JSON.stringify(userInfo),CookieOptions) // Serialize object before storing
        .json({ status: "success", message: existingFollow ?"Unfollowed successfully": "Followed successfully" });
  } catch (error) {
    console.error("Error in FollowUser:", error);
    next(error);
  }
};

// Add a post to the user's archive
export const AddPostToArchive = async (req, res, next) => {
  const { postId } = req.body;
  const userId = req.authUser.id;

  try {

    // Parsing userInfo from cookies to further make modification rather than refetching from user database 
    let userInfo = JSON.parse(req.cookies._userDetail);
    console.log(userInfo)
    // delete if the post is already archived
    const deleted = await Archive.destroy({ where: { postId, userId } });
    if (deleted) {
      console.log("exist")
      userInfo.savedPosts = userInfo.savedPosts.filter((post) => post.id !== postId);
      return res
        .status(200)
        .cookie("_userDetail", JSON.stringify(userInfo), CookieOptions)
        .json({ removed: true, message: "Removed from archive", archived: { postId, userId } });
    }
    console.log('new')
    // Create archive entry & fetch post details in one go
    const archiveWithPost = await Archive.upsert({ postId, userId });
      userInfo.savedPosts.push({id:postId});

    res
      .status(200)
      .cookie("_userDetail", JSON.stringify(userInfo), CookieOptions)
      .json({ message: "Post archived successfully", archived: archiveWithPost });
  } catch (error) {
    console.error("Error archiving post:", error);
    next(error);
  }
};

// Remove archived post for current user
export const removeFromArchive = async (req, res, next) => {
  const userId = req.authUser.id;
  const postId = req.query.id;
  console.log({ postId });
  try {
    const exist = await Archive.findOne({
      where: {  postId, userId },
    });
    if (exist) {
    }
  } catch (error) {
    console.error("Error archiving post:", error);
    next(error);
  }
};
