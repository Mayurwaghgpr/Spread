import { Sequelize } from "sequelize";
import Comments from "../models/Comments.js";
import LikeComment from "../models/LikeComment.js";
import User from "../models/user.js";
import Database from "../utils/database.js";

export const createComment = async (req, res, next) => {
  // console.log("new...");
  // const postId = req.params.postId;
  
  const UserId = req.authUser.id;
  // const { content } = req.body;
    const { postId, replyTo, content,topCommentId } = req.body;
  try {
    const respons = await Comments.create({ postId, UserId, content,topCommentId,replyTo });
    res.status(200).json({ message: "commented successfuly "});
  } catch (error) {
    next(error);
  }
};
// export const replyComment = async (req, res, next) => {
//   const UserId = req.authUser.id;
//   const { topCommentId } = req.params;

//   try {
//     const respons = await Comments.create({
//       postId,
//       UserId,
//       content,
//       topCommentId,
//       replyTo: commentId||null,
//     });
//     res.status(200).json({ message: "commented successfuly " });
//   } catch (error) {
//     next(error);
//   }
// };

export const getTopComments = async (req, res, next) => {
  try {
    const postId = req.query.postId; // Ensure postId is a number
    console.log(postId);
    const limit = Math.max(parseInt(req.query.limit?.trim()) || 5, 1);
    const page = Math.max(parseInt(req.query.page?.trim()) || 1, 1);

    // Count total top-level comments for pagination
    // Fetch paginated comments
    const { count: totalPosts, rows:topComments} = await Comments.findAndCountAll({
      where: { postId, topCommentId: null },
      attributes: [
        "id",
        "content", // Attributes from the Comments table
        "topCommentId",
        "postId",
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
          attributes: ["id", "username", "userImage",],
        },
        {
          model: LikeComment,
          as: "commentLikes",

        },
        {
          model: Comments,
          as: "reply",
          attributes: ['id'],
        }
      ],
      //   group: ["Comment.id", "commenter.id"], // Use the correct alias
      //   order: [[Database.literal("likeCount"), "DESC"]],
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
    next(error);
  }
};

export const getCommentReply = async (req, res, next) => {
  const { postId, topCommentId} = req.query;
  const limit = Math.max(parseInt(req.query.limit?.trim()) || 5, 1);
  const page = Math.max(parseInt(req.query.page?.trim()) || 1, 1);
  try {
    const { count: totalPosts, rows: replys } = await Comments.findAndCountAll({
      where: { postId, topCommentId},
      attributes: [
        "id",
        "content", // Example attributes from the Comments table
        "replyTo",
        "topCommentId",
        "postId",
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
      limit,
      offset: (page - 1) * limit,
    });
    console.log(totalPosts,replys)
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
  console.log(commentId)
  console.log(req.authUser?.id)
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

      res.status(201).json({ message: "removed like", updtCommentLikes });
    } else {
      const result = await LikeComment.create({
        likedBy: req.authUser.id,
        commentId,
      });
      const updtCommentLikes = await LikeComment.findAll({
        where: { commentId },
        attributes: [
          "likedBy",
          "commentId"
        ]
      });
      // console.log('like',result);
      res.status(201).json({ message: "added like", updtCommentLikes });
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
    const result = await Comments.findOne({ where: { id: commentId} });
    if (!result) {
      return res.status(404).send("comment not Found");
    }
    await result.destroy();

    res.status(202).json({ message: "comment delete successfully", result });
  } catch (error) {
    next(error);
  }
};
