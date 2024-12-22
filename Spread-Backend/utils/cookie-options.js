export const CookieOptions = {
  httpOnly: true, // Prevents JavaScript access
  secure: true, // Only for HTTPS
  sameSite: "strict", // Prevents cross-origin issues
  maxAge: 3600000, // 1 hour
};
