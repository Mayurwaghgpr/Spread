import express from "express";
import {
  createComment,
  deleteComment,
  editComment,
  getCommentReply,
  getTopComments,
  likeComment,
  pinComment,
  // replyComment,
} from "../controllers/comments.controller.js";
import IsAuth from "../middlewares/isAuth.middleware.js";

const router = express.Router();

router.get("/top/all", getTopComments);
router.get("/replys/all", getCommentReply);
router.post("/new", IsAuth, createComment);
// router.post("/reply/:topCommentId", IsAuth,replyComment);
router.get("/like/:commentId", IsAuth, likeComment);
router.put("/edit/:commentId", IsAuth, editComment);
router.put("/pin", IsAuth, pinComment);
router.delete("/delete/:commentId", IsAuth, deleteComment);

export default router;
