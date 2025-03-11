import dotenv from "dotenv";
dotenv.config();
export const CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? 'none' : 'Strict',
  maxAge:7*24*60*60*1000
};
