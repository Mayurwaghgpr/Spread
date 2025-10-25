import express from "express";
import {
  getPostPreview,
  getPostView,
  AddNewPost,
  EditPost,
  DeletePost,
  getSavedPost,
  getPostPreviewByUserFollowings,
} from "../controllers/post.controller.js";
import IsAuth from "../middlewares/isAuth.middleware.js";
import { multerFileUpload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Route to get all posts
router.get("/feed", IsAuth, getPostPreview);
router.get("/feed/following", IsAuth, getPostPreviewByUserFollowings);

// Route to get a single post by ID
router.get("/archived", IsAuth, getSavedPost);
router.get("/:id", getPostView);

// Route to add a new post
router.post("/add", IsAuth, multerFileUpload, AddNewPost);

// Route to edit an existing post by ID
router.patch("/:id", IsAuth, multerFileUpload, EditPost);

// Route to delete a post by ID
router.delete("/delete/:postId", IsAuth, DeletePost);

export default router;
