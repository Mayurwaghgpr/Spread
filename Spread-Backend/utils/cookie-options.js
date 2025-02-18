import dotenv from "dotenv";
dotenv.config();
export const CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production" || false,
};
