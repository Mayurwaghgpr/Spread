export const EXPIRATION = 900;

// Salt rounds for bcrypt password hashing
export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
