import Comments from "../models/comments.model.js";
import LikeComment from "../models/likeComment.model.js";
import User from "../models/user.model.js";
import Post from "../models/posts/posts.model.js";
import Database from "../config/database.js";
import sequelize from "sequelize";
import redisClient from "../utils/redisClient.js";
import { EXPIRATION } from "../config/constants.js";
import { createNotification } from "../services/notification.service.js";

//Create Comment
export const createComment = async (req, res, next) => {
  const userId = req.authUser.id;
  const { postId, replyTo, content, topCommentId } = req.body;

  try {
    if (!postId || !content || !content.trim()) {
      return res.status(400).json({ message: "Post ID and content are required." });
    }

    // Create the comment first
    const respons = await Comments.create({
      postId,
      userId,
      content: content?.trim(),
      topCommentId,
      replyTo,
    });

    // Notify post author or reply target author
    const targetPost = await Post.findByPk(postId, { attributes: ["authorId"] });
    if (targetPost?.authorId) {
      createNotification({
        receiverId: targetPost.authorId,
        actorId: userId,
        type: "comment",
        entityId: postId,
        entityType: "post",
        message: `${req.authUser.displayName} commented on your post.`,
      });
    }
    
    // Try to update cache if post exists in cache
    const cachedPost = await redisClient.get(postId);
    if (cachedPost) {
      const post = JSON.parse(cachedPost);
      const newComment = JSON.parse(JSON.stringify(respons));
      const newCommentsArray = [...(post.comments || []), newComment];
      const postWithNewComment = { ...post, comments: newCommentsArray };
      await redisClient.setEx(
        postId,
        EXPIRATION,
        JSON.stringify(postWithNewComment)
      );
    }
    
    // io.emit("update_comment", newComment);
    res.status(200).json({ message: "commented successfuly " });
  } catch (error) {
    console.log("Error creating comment:", error);
    // Handle the error appropriately, e.g., log it and send a response
    error.status = 500; // Set a status code if needed
    error.message = "Failed to create comment";
    next(error);
  }
};

export const getTopComments = async (req, res, next) => {
  try {
    const postId = req.query.postId; // Ensure postId is provided
    const limit = Math.max(parseInt(req.query.limit?.trim()) || 5, 1);
    const page = Math.max(parseInt(req.query.page?.trim()) || 1, 1);

    const { count: totalPosts, rows: topComments } =
      await Comments.findAndCountAll({
        where: { postId, topCommentId: null },
        attributes: [
          "id",
          "content",
          "topCommentId",
          "postId",
          "pind",
          "updatedAt",
          "createdAt",
        ],
        include: [
          {
            model: User,
            as: "commenter",
            attributes: ["id", "username", "userImage"],
          },
          {
            model: LikeComment,
            as: "commentLikes",
          },
          {
            model: Comments,
            as: "replies",
            attributes: ["id"],
          },
        ],
        order: [
          ["pind", "DESC"],
          ["createdAt", "DESC"],
        ],
        limit,
        offset: (page - 1) * limit,
      });

    res.status(200).json({
      comments: topComments,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        hasNextPage: page < Math.ceil(totalPosts / limit),
        totalPosts,
      },
    });
  } catch (error) {
    console.error("Error fetching top comments:", error);
    next(error);
  }
};

export const getCommentReply = async (req, res, next) => {
  const { postId, topCommentId } = req.query;
  const limit = Math.max(parseInt(req.query.limit?.trim()) || 5, 1);
  const page = Math.max(parseInt(req.query.page?.trim()) || 1, 1);
  try {
    const { count: totalPosts, rows: replies } = await Comments.findAndCountAll(
      {
        where: { postId, topCommentId },
        attributes: [
          "id",
          "content", // Example attributes from the Comments table
          "replyTo",
          "topCommentId",
          "postId",
          "pind",
          "updatedAt",
          "createdAt",
          // [
          //   Database.fn("COUNT", Database.col("commentLikes.id")),
          //   "likeCount", // Alias for the count column
          // ],
        ],
        include: [
          {
            model: User,
            as: "commenter",
            attributes: ["id", "username", "userImage"],
          }, // Include commenter info
          {
            model: LikeComment,
            as: "commentLikes",
          },
        ],
        // group: ["Comments.id", "commenter.id"],
        // order: [[Database.literal("likeCount"), "DESC"]], // Order by like count in descending order
        order: [[Database.literal("pind")]],
        limit,
        offset: (page - 1) * limit,
      }
    );
    res.status(200).json({
      replies,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(totalPosts / limit),
        hasNextPage: page < Math.ceil(totalPosts / limit),
        totalPosts,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  const { commentId } = req.params;
  try {
    const exist = await LikeComment.findOne({
      where: { likedBy: req.authUser.id, commentId },
    });
    // console.log(exist)
    if (exist) {
      await exist.destroy();
      const updtCommentLikes = await LikeComment.findAll({
        where: { commentId },
      });

      res.status(201).json({ message: "Unliked", updtCommentLikes });
    } else {
      const result = await LikeComment.create({
        likedBy: req.authUser.id,
        commentId,
      });
      const targetComment = await Comments.findByPk(commentId, { attributes: ["userId", "postId"] });
      if (targetComment?.userId) {
        createNotification({
          receiverId: targetComment.userId,
          actorId: req.authUser.id,
          type: "like",
          entityId: targetComment.postId,
          entityType: "comment",
          message: `${req.authUser.displayName} liked your comment.`,
        });
      }
      const updtCommentLikes = await LikeComment.findAll({
        where: { commentId },
        attributes: ["likedBy", "commentId"],
      });
      res.status(201).json({ message: "Liked", updtCommentLikes });
    }
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  const commentId = req.params.commentId;
  const { content } = req.body;
  try {
    const [_, updatedComment] = await Comments.update(content, {
      where: { id: commentId },
      returning: true,
      plain: true,
    });
    if (!updatedComment) {
      return res.status(404).send("comment not Found");
    }
    res.status(201).json(updatedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  const commentId = req.params.commentId;
  try {
    const result = await Comments.findOne({ where: { id: commentId } });
    if (!result) {
      return res.status(404).send("comment not Found");
    }
    await result.destroy();

    res.status(202).json({ message: "comment delete successfully", result });
  } catch (error) {
    next(error);
  }
};

export const pinComment = async (req, res, next) => {
  const { pin, commentId } = req.body;
  try {
    const [_, result] = await Comments.update(
      { pind: pin },
      {
        where: { id: commentId },
        returning: true,
        plain: true,
      }
    );
    res.status(202).json({ message: "comment pind successfully", result });
  } catch (error) {
    next(error);
  }
};
