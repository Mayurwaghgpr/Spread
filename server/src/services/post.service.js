import { Op } from "sequelize";
import { EXPIRATION } from "../config/constants.js";
import Comments from "../models/comments.model.js";
import Likes from "../models/likes.model.js";
import PostBlock from "../models/posts/postBlock.model.js";
import Post from "../models/posts/posts.model.js";
import User from "../models/user.model.js";
import redisClient from "../utils/redisClient.js";
import Tag from "../models/tags.model.js";

class PostService {
  async findPostById({ id }) {
    const cachedData = await redisClient.get(id);
    if (cachedData !== null) {
      console.log("cache hit");
      return JSON.parse(cachedData);
    }
    const post = await Post.findOne({
      where: { id },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "userImage", "displayName"],
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
        },
        {
          model: Likes, // Include likes
          as: "Likes",
          required: false,
          attributes: ["id", "type", "likedBy", "createdAt", "updatedAt"],
        },
        {
          model: PostBlock,
          as: "postBlocks",
          required: false,
        },
        {
          model: Comments,
          as: "comments",
          attributes: [
            "id",
            "userId",
            "postId",
            "topCommentId",
            "replyTo",
            "content",
            "pind",
          ],
        },
      ],
    });

    await redisClient.setEx(id, EXPIRATION, JSON.stringify(post));
    return post;
  }
  async getPaginatedPosts({ lastTimestamp, limit, cacheKey }) {
    // Unique cache key for this combination
    // Checking Cache
    const cachedPostData = await redisClient.get(cacheKey);
    if (cachedPostData !== null) {
      return JSON.parse(cachedPostData);
    }
    // Fetch posts from DB if not in redis cache
    const posts = await Post.findAll({
      attributes: [
        "id",
        "title",
        "subtitle",
        "cloudinaryPubId",
        "publicationId",
        "previewImage",
        "publishedAt",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "username", "userImage"],
        },
        {
          model: Likes,
          as: "Likes",
          attributes: ["id", "type", "likedBy", "createdAt", "updatedAt"],
        },
        {
          model: Comments,
          as: "comments",
          attributes: ["id", "userId", "topCommentId", "replyTo"],
        },
        {
          model: Tag,
          as: "tags",
          through: { attributes: [] },
        },
      ],
      where: {
        createdAt: { [Op.lt]: lastTimestamp },
      },
      order: [["createdAt", "DESC"]],
      limit,
    });
    // Caching the result to redis with expiration time
    await redisClient.setEx(cacheKey, 300, JSON.stringify(posts));
    return posts;
  }
  async deletPost() {}
}

export default new PostService();
