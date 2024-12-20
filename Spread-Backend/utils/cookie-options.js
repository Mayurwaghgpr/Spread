export const CookieOptions = {
  httpOnly: true, // Prevents JavaScript access
  secure: false, // Only for HTTPS
  sameSite: "none", // Prevents cross-origin issues
  maxAge: 3600000, // 1 hour
};
