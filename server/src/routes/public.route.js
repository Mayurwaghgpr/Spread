import express from "express";
import {
  searchData,
  FollowUser,
  AddPostToSavedPost,
  LikePost,
  getHomeContent,
  getAllUser,
  getPeoples,
} from "../controllers/public.controller.js";
import IsAuth from "../middlewares/isAuth.middleware.js"; // Import the authentication middleware

const router = express.Router();

// Route to get preparation data for posts (authenticated users only)
router.get("/h/content", IsAuth, getHomeContent);

// Route to get all platform users
router.get("/h/peoples", IsAuth, getPeoples);

// Route to get platform users
router.get("/users/all", IsAuth, getAllUser);

// Route to search for posts based on query parameters (authenticated users only)
router.get("/search", IsAuth, searchData);

// Put Routes
router.put("/like/", IsAuth, LikePost);
router.put("/follow", IsAuth, FollowUser);
router.put("/save", IsAuth, AddPostToSavedPost); // Changed route to 'archive' for consistency

export default router;
