import express from 'express';
const router = express.Router();
import {  forgotPass, resetPassword, refreshToken, signUp, signIn, logout } from '../controllers/auth.controller.js';
import IsAuth from '../middlewares/isAuth.js';
import passport from 'passport';
import { gitHubAuth, googleAuth } from '../controllers/mediaAuth.controller.js';
import dotenv from 'dotenv';
dotenv.config();

// Route to initiate Google login
router.get(
  '/login/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false ,prompt: 'select_account',successRedirect:process.env.FRONT_END_URL})
);

// Route to handle Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect:process.env.FRONT_END_URL +'signin'}),
  googleAuth
);

// Route to initiate GitHub login
router.get('/login/github',
  passport.authenticate('github', { scope: ['profile', 'email'], session: false ,prompt: 'select_account'})
);

// Route to handle GitHub OAuth callback
router.get('/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: process.env.FRONT_END_URL + 'signin' }),gitHubAuth
);

// Route to handle token refresh
router.get('/refresh-token', refreshToken);

// Route to handle user sign up
router.post('/signup', signUp);

// Route to handle user login
router.post('/signin', signIn);

// Route to handle user logout, requires authentication
router.delete('/logout', IsAuth, logout);

router.post('/forgotpassword',forgotPass)

//Route to handle reset password,
router.put('/resetpassword/:token',resetPassword)



export default router;
