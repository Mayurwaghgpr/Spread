import express from 'express';
import {
  EditUserProfile,
  getUserPostsById,
  getUserProfile,
  getFollowers,
  getFollowing,
  getLoginUser,

} from '../controllers/user.js';
import IsAuth from '../middlewares/isAuth.js';
import { multerFileUpload } from '../middlewares/multer.middleware.js';

const router = express.Router();

// Get Routes
router.get('/profile/:id', IsAuth, getUserProfile);
router.get('/details', IsAuth, getLoginUser); 
router.get('/posts/:userId', IsAuth, getUserPostsById);
router.get('/followers/:userId', IsAuth, getFollowers);
router.get('/following/:userId', IsAuth, getFollowing);


// Post Routes
router.post('/profile/edit', IsAuth,multerFileUpload, EditUserProfile);


export default router;
