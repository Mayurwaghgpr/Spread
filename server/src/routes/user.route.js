import express from "express";
import {
  EditUserProfile,
  getUserPostsById,
  getUserProfile,
  getFollowers,
  getFollowing,
  searchForUsername,
} from "../controllers/user.controller.js";
import IsAuth from "../middlewares/isAuth.middleware.js";
import { multerFileUpload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Get Routes
router.get("/profile/:id", getUserProfile);

router.get("/posts/:userId", IsAuth, getUserPostsById);
router.get("/followers/:userId", IsAuth, getFollowers);
router.get("/following/:userId", IsAuth, getFollowing);

// Post Routes
router.post("/profile/edit", IsAuth, multerFileUpload, EditUserProfile);
router.post("/search/username", searchForUsername);

export default router;
