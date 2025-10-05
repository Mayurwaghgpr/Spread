import { generateFromEmail } from "unique-username-generator";
import User from "../models/user.model.js"; // Sequelize User model

const genUniqueUserName = async (email) => {
  const tried = new Set();

  const maxAttempts = 10; // Safety limit to avoid infinite loops
  for (let i = 0; i < maxAttempts; i++) {
    // Generate a username from the email
    const username = generateFromEmail(email, 4);

    // Avoid duplicate checks
    if (tried.has(username)) continue; // Skip duplicates
    tried.add(username);

    // Check if the username already exists in the database
    const exist = await User.findOne({ where: { username } });

    // If it doesn't exist, return it
    if (!exist) return username;
  }

  throw new Error(
    "Unable to generate a unique username after multiple attempts."
  );
};

export default genUniqueUserName;
