import dotenv from "dotenv";
import AccessAndRefreshTokenGenerator from "../utils/AccessAndRefreshTokenGenerator.js";
import { CookieOptions } from "../utils/cookie-options.js";

dotenv.config();

export const googleAuth = async (req, res, next) => {
  const user = req.user;
  try {
    const { AccessToken, RefreshToken } = AccessAndRefreshTokenGenerator({
      id: user.id,
      email: user.email,
    });

    res
      .cookie("AccessToken", AccessToken, CookieOptions)
      .cookie("RefreshToken", RefreshToken, CookieOptions)
      .cookie("_userDetail", user, { httpOnly: true, secure: false})
      .redirect(process.env.FRONT_END_URL);
  } catch (error) {
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

    res
      .cookie("AccessToken", AccessToken, CookieOptions)
      .cookie("RefreshToken", RefreshToken, CookieOptions)
      .cookie("_userDetail", user, { httpOnly: true, secure: false })
      .redirect(process.env.FRONT_END_URL);
  } catch (error) {
    next(error);
  }
};
