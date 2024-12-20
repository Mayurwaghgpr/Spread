export const CookieOptions = {
  httpOnly: true, // Prevents JavaScript access
  secure: process.env.NODE_ENV === "production", // Only for HTTPS
  sameSite: "Strict", // Prevents cross-origin issues
  maxAge: 3600000, // 1 hour
};
