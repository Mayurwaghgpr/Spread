import Sequelize, { Op } from "sequelize";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Post from "../models/posts.model.js";
dotenv.config();
const saltRounds = process.env.SALT_ROUNDS || 10;
class UserService {
  async finduser(...args) {
    // Fetch user profile information
    const userInfo = await User.findOne({
      where: { [Op.and]: args },
      include: [
        {
          model: User,
          as: "Followers",
          through: { attributes: [] }, // Exclude through table attributes
          attributes: ["id"], // Fetch only necessary fields
        },
        {
          model: User,
          as: "Following",
          through: { attributes: [] }, // Exclude through table attributes
          attributes: ["id"], // Fetch only necessary fields
        },
        {
          model: Post,
          as: "posts",
          attributes: ["id"],
        },
        {
          model: Post,
          as: "savedPostsList",
          through: { attributes: [] }, // Fetch only related posts
          attributes: ["id"],
        },
      ],
    });

    return userInfo || null;
  }
  async register({ email, password, displayName }) {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ email }],
      },
    });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = await User.create({
      displayName,
      email,
      password: hashedPassword,
      signedWith: "manual",
    });

    // Remove password before returning
    const userData = newUser.get({ plain: true });
    delete userData.password;

    return userData;
  }

  // Login existing user
  async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("User not found");
    // If user signed up via OAuth
    if (user.signedWith !== "manual" || user.signedWith !== null) {
      throw new Error(
        `This account is registered using ${user.signedWith}. Please login with ${user.signedWith} instead.`
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    // Return sanitized user object
    const userData = user.get({ plain: true });
    delete userData.password;

    return userData;
  }
}
export default new UserService();
