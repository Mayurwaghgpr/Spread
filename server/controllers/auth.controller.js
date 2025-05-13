import User from "../models/user.js";
import Sequelize, { where } from "sequelize";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import AccessAndRefreshTokenGenerator from "../utils/AccessAndRefreshTokenGenerator.js";
import { mailTransporter } from "../utils/sendMail.js";
import { CookieOptions } from "../utils/cookie-options.js";
import Post from "../models/posts.js";
import genUniqueUserName from "../utils/UserNameGenerator.js";
import redisClient from "../utils/redisClient.js";
import { EXPIRATION } from "../config/constants.js";

dotenv.config();
const saltRounds = 10;

// Sign up a new user
export const signUp = async (req, res, next) => {
  const { displayName, email, password } = req.body;
  // Validate required fields
  if (!displayName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ email }],
      },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }


    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const username = await genUniqueUserName(email);
    const newAddedUser = await User.create({
      username,
      displayName,
      email,
      password: hashedPassword,
    });

    // Generate access and refresh tokens
    const { AccessToken, RefreshToken } = AccessAndRefreshTokenGenerator({
      id: newAddedUser.id,
      email:email,
    });

    if (!AccessToken || !RefreshToken) {
      throw new Error("Failed to generate tokens");
    }

    const newUser = { ...newAddedUser.toJSON() };

    delete newUser.password;

    await redisClient.set(newUser.id,JSON.stringify(newUser))

    // Set tokens as cookies and respond
    res
      .status(201)
      .cookie("AccessToken", AccessToken, CookieOptions)
      .cookie("RefreshToken", RefreshToken, CookieOptions)
      .cookie("_userDetail", JSON.stringify(newUser), CookieOptions)
      .json({ user: newUser.dataValues, AccessToken, RefreshToken });
  } catch (err) {
    next(err);
    console.error("Error during sign up:", err);
    // res.status(500).json({ message: 'Server error' });
  }
};

// Log in an existing user
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Find user by username
    const user = await User.findOne({
      where: { email},
      include: [
        {
          model: User,
          as: "Followers",
          through: { attributes: { exclude: ["password"] } },
        },
        {
          model: User,
          as: "Following",
          through: { attributes: { exclude: ["password"] } },
        },
         {
            model: Post,
            attributes: ['id']
        },
        {
            model: Post,
            as: 'savedPosts',
            through: { attributes: [] }, // Fetch only related posts
          },
      ],
    });

    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Compare provided password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate access and refresh tokens
    const { AccessToken, RefreshToken } = AccessAndRefreshTokenGenerator({
      id: user.id,
      email: user.email,
    });

    if (!AccessToken || !RefreshToken) {
      throw new Error("Failed to generate tokens");
    }
    await redisClient.set(user.id,JSON.stringify(user))
    // Set tokens as cookies and respond
       res
      .cookie("_userDetail", JSON.stringify(user),CookieOptions)
      .cookie("AccessToken", AccessToken, CookieOptions)
      .cookie("RefreshToken", RefreshToken, CookieOptions)
      .status(200)
      .json({ user: user.dataValues, AccessToken, RefreshToken })
   
  } catch (err) {
    console.error("Error during login:", err);
    next(err);
    // res.status(500).json({ message: err.message });
  }
};


//Fetch login user details
export const getLoginUser = async (req, res, nex) => {
  const userInfo = req.cookies._userDetail || await redisClient.get(req.authUser.id);

  res.status(200).json(userInfo);
};

// Refresh access token using refresh token
export const refreshToken = async (req, res, next) => {
  // Extract token from cookies or Authorization header
  const clientRefreshToken =
    req.cookies.RefreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!clientRefreshToken) {
    return res.status(401).json({ message: "Unauthorized request" });
  }

  try {
    // Verify refresh token
    const decodedToken = jwt.verify(
      clientRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const { dataValues: user } = await User.findByPk(decodedToken.id);
    // console.log(user)
    // console.log(decodedToken)
    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Check if the refresh token matches the one stored in the database
    if (decodedToken.exp < new Date.now()) {
      return res
        .status(401)
        .json({ message: "Refresh token is expired or used" });
    }

    // Generate new access and refresh tokens
    const { AccessToken, RefreshToken } = AccessAndRefreshTokenGenerator({
      id: decodedToken.id,
      email: decodedToken.email,
    });

    // Update user with new refresh token
    // await User.update({ refreshToken: RefreshToken }, { where: decodedToken.id });

    // Set new tokens as cookies and respond
    res
      .status(200)
      .cookie("AccessToken", AccessToken, CookieOptions)
      .cookie("RefreshToken", RefreshToken, CookieOptions)
      .cookie("_userDetail", JSON.stringify(user),CookieOptions)
      .json({ user: user, AccessToken, RefreshToken });
  } catch (error) {
    console.error("Error during token refresh:", error);
    next(error);
    // res.status(500).json({ message: 'Internal server error' });
  }
};

// Log out the user by clearing cookies and updating user record
export const logout = async (req, res, next) => {
  const option = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
   sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
 }
  res
    .clearCookie("AccessToken", option)
    .clearCookie("RefreshToken", option)
    .clearCookie("_userDetail", option);
  try {
   
    // Clear refresh token from user record
    await User.update(
      { refreshToken: null },
      { where: { id: req.authUser.id } }
    );
    await redisClient.del(req.authUser.id)
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error during logout:", error);
    // res.status(500).json({ message: 'Server error' });
    next(error);
  }
};

export const forgotPass = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    // console.log(user)
    if (!user) {
      res.status(404).json({ message: "user not Found" });
      return;
    }

    const { AccessToken } = AccessAndRefreshTokenGenerator({ email });

    const mail = await mailTransporter.sendMail({
      to: email,

      subject: "Reset password for Spread",
      html: `<p>Click the link below to reset your password:</p>
        <a href="${process.env.FRONT_END_URL}/reset/pass/${AccessToken}" style="color: #1a73e8; text-decoration: none;">
            Reset Password
        </a>
        <p>If you did not request this, please ignore this email.</p>`,
    });

    res
      .status(200)
      .json({ success: "Mail successfuly sent to " + mail.messageId });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const token = req.params.token;
  const newpassword = req.body.password;
  // console.log(token)
  try {
    let decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (decodeToken.exp * 1000 < Date.now()) {
      return res
        .status(401)
        .json({ message: "token has expired ,cannot Reset password" });
    }
    const email = decodeToken.email;
    const hashedPassword = await bcrypt.hash(newpassword, saltRounds);
    await User.update(
      { password: hashedPassword },
      { where: { email: email } }
    );
    res.status(200).json({ success: "Password updated successfuly" });
  } catch (error) {
    next(error);
  }
};
