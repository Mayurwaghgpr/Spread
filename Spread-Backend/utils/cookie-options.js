export const CookieOptions = {
    decode: decodeURIComponent,
 httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
       maxAge: 86400 * 1000,
};
