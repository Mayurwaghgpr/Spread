import express from "express";
import {
  createComment,
  deleteComment,
  editComment,
  getCommentReply,
  getTopComments,
  likeComment,
  replyComment,
} from "../controllers/comments.js";

const router = express.Router();

router.get("/top", getTopComments);
router.post("/replys", getCommentReply);
router.post("/new/:postId", createComment);
router.post("/reply/:topCommentId", replyComment);
router.post("/like/:commentId", likeComment);
router.put("/edit/:commentId", editComment);
router.delete("/delete/:commentId", deleteComment);

export default router;
