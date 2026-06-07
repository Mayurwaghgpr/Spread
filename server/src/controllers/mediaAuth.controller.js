import dotenv from "dotenv";
import AccessAndRefreshTokenGenerator from "../utils/AccessAndRefreshTokenGenerator.js";
import { CookieOptions } from "../utils/cookie-options.js";
import redisClient from "../utils/redisClient.js";


dotenv.config();

export const googleAuth = async (req, res, next) => {
  const user = req.user;
  try {
    console.log("googleAuth controller - User:", user ? user.id : "NO USER");
    
    if (!user) {
      console.error("No user in req.user - authentication failed");
      return res.redirect(process.env.FRONT_END_URL + "/heroes");
    }
    
    const { AccessToken, RefreshToken } = AccessAndRefreshTokenGenerator({
      id: user.id,
      email: user.email,
    });

    console.log("Tokens generated, setting cookies and redirecting");
    await redisClient.set(user.id, JSON.stringify(user));
    
    res
      .cookie("AccessToken", AccessToken, CookieOptions)
      .cookie("RefreshToken", RefreshToken, CookieOptions)
      .redirect(process.env.FRONT_END_URL + "/");
  } catch (error) {
    console.error("Error in googleAuth controller:", error);
    next(error);
  }
};

export const gitHubAuth = async (req, res, next) => {
  const user = req.user;
  try {
    const { AccessToken, RefreshToken } = AccessAndRefreshTokenGenerator({
      id: user.id,
      email: user.email,
    });
    await redisClient.set(user.id, JSON.stringify(user))

    res
      .cookie("AccessToken", AccessToken, CookieOptions)
      .cookie("RefreshToken", RefreshToken, CookieOptions)

      .redirect(process.env.FRONT_END_URL);
  } catch (error) {
    next(error);
  }
};
