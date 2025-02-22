import express from 'express';
import {  
  searchData, 
  FollowUser,
  AddPostToArchive,
  removeFromArchive,
  LikePost,
  getHomeContent,
} from '../controllers/public.controller.js';
import IsAuth from '../middlewares/isAuth.js'; // Import the authentication middleware

const router = express.Router();

// Route to get preparation data for posts (authenticated users only)
router.get('/h/content', IsAuth, getHomeContent);


// Route to search for posts based on query parameters (authenticated users only)
router.get("/search", IsAuth, searchData);


// Put Routes
router.put('/like/',IsAuth,LikePost)
router.put('/follow', IsAuth, FollowUser);
router.put('/archive', IsAuth, AddPostToArchive);// Changed route to 'archive' for consistency


//Delete Routes
router.delete('/archive',IsAuth,removeFromArchive)

export default router;
