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
} from "../controllers/comments.js";
import IsAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.get("/top", getTopComments);
router.get("/replys", getCommentReply);
router.post("/new",IsAuth, createComment);
// router.post("/reply/:topCommentId", IsAuth,replyComment);
router.get("/like/:commentId",IsAuth, likeComment);
router.put("/edit/:commentId", IsAuth, editComment);
router.put('/pin',pinComment)
router.delete("/delete/:commentId", IsAuth, deleteComment);


export default router;
