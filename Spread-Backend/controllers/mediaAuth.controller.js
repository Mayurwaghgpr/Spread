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
      .cookie("_userDetail",JSON.stringify(user) ,{ httpOnly: true, secure: true, sameSite: "Strict" })
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
      .cookie("_userDetail", JSON.stringify(user), { httpOnly: true, secure: true, sameSite: "Strict" })
      .redirect(process.env.FRONT_END_URL);
  } catch (error) {
    next(error);
  }
};
