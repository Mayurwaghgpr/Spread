export const CookieOptions = {
   httpOnly: true,      // Accessible only by the server
    secure: true,       // Not secure, since we're on HTTP on localhost
  sameSite: 'none',
};
