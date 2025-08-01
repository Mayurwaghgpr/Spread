import Comments from "../models/Comments.js";
import LikeComment from "../models/LikeComment.js";
import User from "../models/user.js";
import Database from "../db/database.js";
import sequelize from "sequelize";
import redisClient from "../utils/redisClient.js";
import { EXPIRATION } from "../config/constants.js";
// import { io } from "../app.js";

//Create Comment
export const createComment = async (req, res, next) => {
  const userId = req.authUser.id;
  const { postId, replyTo, content, topCommentId } = req.body;
  console.log(postId, replyTo, content, topCommentId, userId);

  try {
    const post = JSON.parse(await redisClient.get(postId));
    const respons = await Comments.create({
      postId,
      userId,
      content: content?.trim(),
      topCommentId,
      replyTo,
    });
    const newComment = JSON.parse(JSON.stringify(respons));
    const newCommentsArray = [...post.comments, newComment];
    const postWithNewComment = { ...post, comments: newCommentsArray };
    await redisClient.setEx(
      postId,
      EXPIRATION,
      JSON.stringify(postWithNewComment)
    );
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
            as: "reply",
            attributes: ["id"],
          },
        ],
        order: [
          [
            // Fully qualify the column "pind" with the table alias "Comment"
            sequelize.literal(`
            CASE
              WHEN "Comment"."pind" = true THEN 1
              WHEN "Comment"."pind" = false THEN 2
              ELSE 3
            END
          `),
            "ASC", // Ensures `true` (1) comes first, then `false` (2), then `null` (3)
          ],
          ["createdAt", "DESC"], // Optional: Sort by creation time within the same `pind` group
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
    const { count: totalPosts, rows: replys } = await Comments.findAndCountAll({
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
    });
    console.log(totalPosts, replys);
    res.status(200).json({
      comments: replys,
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
      const updtCommentLikes = await LikeComment.findAll({
        where: { commentId },
        attributes: ["likedBy", "commentId"],
      });
      // console.log('like',result);
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
