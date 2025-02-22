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

export const LikePost = async (req, res, next) => {
  const postId = req.body.postId;
  const type = req.body.liketype;
  // console.log({ postId })
  // console.log({likedBy: req.authUser.id,})

  try {
    const exist = await Likes.findOne({
      where: { likedBy: req.authUser.id, postId: postId },
    });
    // console.log(exist)
    if (exist && !type) {
      await exist.destroy();
      const updtLikes = await Likes.findAll({ where: { postId } });

      res.status(201).json({ message: "removed like", updtLikes });
    } else if (exist && type) {
      await Likes.update(
        { type: type },
        { where: { likedBy: req.authUser.id, postId: postId } }
      );
      const updtLikes = await Likes.findAll({ where: { postId } });
      res.status(201).json({ message: "like updated", updtLikes });
    } else {
      const result = await Likes.create({
        likedBy: req.authUser.id,
        postId,
        type,
      });
      const updtLikes = await Likes.findAll({ where: { postId } });
      // console.log('like',result)
      res.status(201).json({ message: "added like", updtLikes });
    }
  } catch (error) {
    next(error);
  }
};

// Follow/unfollow a user
export const FollowUser = async (req, res, next) => {
  const { followerId, followedId } = req.body;

  // Prevent users from following themselves
  if (followerId === followedId) {
    return res
      .status(400)
      .json({ status: "error", message: "You cannot follow yourself" });
  }

  try {
    // Check if the follow relationship already exists
    const existingFollow = await Follow.findOne({
      where: { followerId, followedId },
    });

    if (existingFollow) {
      // Unfollow user
      await existingFollow.destroy();
      const userInfo = await dataFetcher.Profile(req.authUser.id);
      // console.log(userInfo);

      res
        .status(200)
        .cookie("_userDetail", userInfo, CookieOptions) // Serialize object before storing
        .json({ message: "Unfollowed successfully" });
    } else {
      // Follow user
      await Follow.create({ followerId, followedId });
      const userInfo = await dataFetcher.Profile(req.authUser.id);
      // console.log(userInfo);

      // Optionally clear Redis cache if implemented
      // await redisClient.del(followerId);

      res
        .status(201)
        .cookie("_userDetail",  userInfo,CookieOptions) // Serialize object before storing
        .json({ status: "success", message: "Followed successfully" });
    }
  } catch (error) {
    console.error("Error in FollowUser:", error);
    next(error);
  }
};

// Add a post to the user's archive
export const AddPostToArchive = async (req, res, next) => {
  const { postId } = req.body;
  const userId = req.authUser.id;
  let userInfo = JSON.parse(req.cookies._userDetail);
  
  try {

    const archived = await Archive.findOne({ where: { postId, userId } });
    // console.log(userInfo)
    if (archived) {
      const newSavedPosts = userInfo.savedPosts.filter((post) => { post.id !== postId });
      console.log(newSavedPosts)
      userInfo={...userInfo,savedPosts: newSavedPosts}
      await archived.destroy();
      return res.status(200).cookie("_userDetail", userInfo, CookieOptions).json({removed:true, message: "Removed from archive", archived: {postId,userId} });
    }

    // Use transaction for safety and performance
    const result = await Archive.create({ postId, userId });
    console.log({ result })
    let strResult = JSON.stringify(result)
    userInfo.savedPosts.push(JSON.parse(strResult))
    console.log("saved posts",userInfo.savedPosts)

    res
      .status(200)
      .cookie("_userDetail", userInfo, CookieOptions)
      .json({ message: "Post archived successfully", archived: result });
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
