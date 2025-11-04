import express from "express";
import {
  searchData,
  FollowUser,
  addPostToSavedPost,
  LikePost,
  getQuickUserSuggestion,
  getAllUser,
  getAllSuggestedUsers,
  getQuickTrendingTags,
} from "../controllers/public.controller.js";
import IsAuth from "../middlewares/isAuth.middleware.js"; // Import the authentication middleware

const router = express.Router();

// Route to get quick suggested users
router.get("/h/q/suggest/user", IsAuth, getQuickUserSuggestion);

// Route to get quick trending tags
router.get("/h/q/tags", IsAuth, getQuickTrendingTags);

// Route to get all platform users
router.get("/h/all/users", IsAuth, getAllSuggestedUsers);

// Route to get platform users
router.get("/users/all", IsAuth, getAllUser);

// Route to search for posts based on query parameters (authenticated users only)
router.get("/search", IsAuth, searchData);

// Put Routes
router.put("/like/", IsAuth, LikePost);
router.put("/follow", IsAuth, FollowUser);
router.put("/save", IsAuth, addPostToSavedPost); // Changed route to 'archive' for consistency

export default router;
