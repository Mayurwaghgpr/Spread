import { Op } from "sequelize";
import { EXPIRATION } from "../config/constants.js";
import Comments from "../models/comments.model.js";
import Likes from "../models/likes.model.js";
import PostContent from "../models/postContent.model.js";
import Post from "../models/posts.model.js";
import User from "../models/user.model.js";
import redisClient from "../utils/redisClient.js";

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
          attributes: ["id", "username", "userImage", "displayName"],
        },
        {
          model: Likes, // Include likes
          as: "Likes",
          required: false,
          attributes: ["id", "type", "likedBy", "createdAt", "updatedAt"],
        },
        {
          model: PostContent,
          as: "postContent",
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
  async getPaginatedPosts({
    lastTimestamp,
    limit,
    topicFilter = {},
    cacheKey,
  }) {
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
        "topic",
        "cloudinaryPubId",
        "publicationId",
        "previewImage",
        "publishedAt",
        "createdAt",
        "updatedAt",
      ],
      include: [
        { model: User, attributes: ["id", "username", "userImage"] },
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
      ],
      where: {
        createdAt: { [Op.lt]: lastTimestamp },
        ...topicFilter,
      },
      order: [["createdAt", "DESC"]],
      limit,
    });
    // Caching the result to redis with expiration time
    await redisClient.setEx(cacheKey, 300, JSON.stringify(posts));
    return posts;
  }
}

export default new PostService();
