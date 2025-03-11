import dotenv from "dotenv";
import AccessAndRefreshTokenGenerator from "../utils/AccessAndRefreshTokenGenerator.js";
import { CookieOptions } from "../utils/cookie-options.js";
import redisClient from "../utils/redisClient.js";


dotenv.config();

export const googleAuth = async (req, res, next) => {
  const user = req.user;
  try {
    const { AccessToken, RefreshToken } = AccessAndRefreshTokenGenerator({
      id: user.id,
      email: user.email,
    });
// console.log("Setting cookies:", {
//   _userDetail: user,
//   AccessToken: AccessToken,
//   RefreshToken: RefreshToken,
// });
    res
      .cookie("_userDetail",JSON.stringify(user),CookieOptions)
      .cookie("AccessToken", AccessToken, CookieOptions)
      .cookie("RefreshToken", RefreshToken, CookieOptions)
      .redirect(process.env.FRONT_END_URL+"/");
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
      .cookie("_userDetail", JSON.stringify(user), CookieOptions)
      .cookie("AccessToken", AccessToken, CookieOptions)
      .cookie("RefreshToken", RefreshToken, CookieOptions)

      .redirect(process.env.FRONT_END_URL);
  } catch (error) {
    next(error);
  }
};
