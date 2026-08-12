import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import AccessAndRefreshTokenGenerator from "../utils/AccessAndRefreshTokenGenerator.js";
import { mailTransporter } from "../utils/sendMail.js";
import { CookieOptions } from "../utils/cookie-options.js";
import redisClient from "../utils/redisClient.js";
import userService from "../services/user.service.js";
import { EXPIRATION, SALT_ROUNDS } from "../config/constants.js";

dotenv.config();

// Sign up a new user
export const signUp = async (req, res, next) => {
  const { displayName, email, password } = req.body;
  
  if (!displayName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newUser = await userService.register({
      email,
      password,
      displayName,
    });

    // Generate access and refresh tokens
    const { AccessToken, RefreshToken } = AccessAndRefreshTokenGenerator({
      id: newUser.id,
      email: email,
    });

    if (!AccessToken || !RefreshToken) {
      throw new Error("Failed to generate tokens");
    }

    await redisClient.setEx(newUser.id, EXPIRATION, JSON.stringify(newUser));

    res
      .status(201)
      .cookie("AccessToken", AccessToken, CookieOptions)
      .cookie("RefreshToken", RefreshToken, CookieOptions)
      .json({ user: newUser, AccessToken, RefreshToken });
  } catch (err) {
    next(err);
  }
};

// Log in an existing user
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await userService.login({ email, password });
    
    const { AccessToken, RefreshToken } = AccessAndRefreshTokenGenerator({
      id: user.id,
      email: user.email,
    });

    if (!AccessToken || !RefreshToken) {
      throw new Error("Failed to generate tokens");
    }

    await redisClient.setEx(user.id, EXPIRATION, JSON.stringify(user));

    res
      .cookie("AccessToken", AccessToken, CookieOptions)
      .cookie("RefreshToken", RefreshToken, CookieOptions)
      .status(200)
      .json({ user: user, AccessToken, RefreshToken });
  } catch (err) {
    next(err);
  }
};

// Fetch login user details
export const getLoginUser = async (req, res, next) => {
  try {
    const userInfo = await redisClient.get(req.authUser.id);
    if (userInfo) {
      return res.status(200).json(JSON.parse(userInfo));
    }
    const userInfoFromDatabase = await userService.finduser({
      id: req.authUser.id,
    });
    if (userInfoFromDatabase) {
      await redisClient.set(
        req.authUser.id,
        JSON.stringify(userInfoFromDatabase)
      );
    }
    res.status(200).json(userInfoFromDatabase);
  } catch (error) {
    console.error("Error during fetching user data", error);
    next(error);
  }
};

// Refresh access token using refresh token
export const refreshToken = async (req, res, next) => {
  const clientRefreshToken =
    req.cookies?.RefreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!clientRefreshToken) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  try {
    const decodedToken = jwt.verify(
      clientRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findByPk(decodedToken.id);
    
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const { AccessToken, RefreshToken } = AccessAndRefreshTokenGenerator({
      id: decodedToken.id,
      email: decodedToken.email,
    });

    const userData = user.get({ plain: true });
    delete userData.password;

    res
      .status(200)
      .cookie("AccessToken", AccessToken, CookieOptions)
      .cookie("RefreshToken", RefreshToken, CookieOptions)
      .json({ user: userData, AccessToken, RefreshToken });
  } catch (error) {
    console.error("Error during token refresh:", error);
    res.status(401).json({ message: "Invalid or expired refresh token" });
  }
};

// Log out user
export const logout = async (req, res, next) => {
  const option = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  };

  try {
    if (req.authUser?.id) {
      await User.update(
        { refreshToken: null },
        { where: { id: req.authUser.id } }
      );
      await redisClient.del(req.authUser.id);
    }
    res
      .clearCookie("AccessToken", option)
      .clearCookie("RefreshToken", option)
      .json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    next(error);
  }
};

// Forgot password link email
export const forgotPass = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "No account found with this email" });
    }

    // Generate dedicated short-lived reset token (15m)
    const resetToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Save token state in Redis to ensure single-use invalidation
    await redisClient.setEx(`reset:${user.id}`, 900, resetToken);

    const mail = await mailTransporter.sendMail({
      to: email,
      subject: "Reset your password for Spread",
      html: `<p>Click the link below to reset your password for your Spread account:</p>
        <p><a href="${process.env.FRONT_END_URL}/reset/pass/${resetToken}" style="color: #1a73e8; text-decoration: none; font-weight: bold;">
            Reset Password
        </a></p>
        <p>This reset link will expire in 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>`,
    });

    res.status(200).json({ message: "Password reset link sent to " + email });
  } catch (error) {
    next(error);
  }
};

// Reset password using token
export const resetPassword = async (req, res, next) => {
  const token = req.params.token;
  const newpassword = req.body.password;

  try {
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
    // Check if token matches active Redis single-use token
    const activeToken = await redisClient.get(`reset:${decodeToken.id}`);
    if (!activeToken || activeToken !== token) {
      return res
        .status(401)
        .json({ message: "Password reset token is invalid or has already been used." });
    }

    const hashedPassword = await bcrypt.hash(newpassword, SALT_ROUNDS);
    await User.update(
      { password: hashedPassword },
      { where: { id: decodeToken.id } }
    );

    // Invalidate token in Redis after successful reset
    await redisClient.del(`reset:${decodeToken.id}`);

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(400).json({ message: "Invalid or expired reset token" });
  }
};
