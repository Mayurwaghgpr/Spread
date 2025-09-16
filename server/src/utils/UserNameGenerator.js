import { generateFromEmail } from "unique-username-generator";
import User from "../models/user.model.js"; // Sequelize User model

const genUniqueUserName = async (email) => {
  let prev = "";
  const maxAttempts = 10; // Safety limit to avoid infinite loops
  let attempts = 0;

  while (attempts < maxAttempts) {
    // Generate a username from the email
    const username = generateFromEmail(email, 4);

    // Avoid duplicate checks
    if (username !== prev) {
      prev = username;

      // Check if the username already exists in the database
      const exist = await User.findOne({ where: { username } });

      // If it doesn't exist, return it
      if (!exist) {
        return username;
      }
    }

    attempts++;
  }

  throw new Error(
    "Unable to generate a unique username after multiple attempts."
  );
};

export default genUniqueUserName;
