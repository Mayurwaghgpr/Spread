import Sequelize, { Op } from "sequelize";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import Post from "../models/posts/posts.model.js";
import { SALT_ROUNDS } from "../config/constants.js";
import genUniqueUserName from "../utils/UserNameGenerator.js";
import { bloomFilter } from "../utils/BloomFilter.js";

dotenv.config();

class UserService {
  async finduser(...args) {
    const userInfo = await User.findOne({
      where: { [Op.and]: args },
      include: [
        {
          model: User,
          as: "Followers",
          through: { attributes: [] },
          attributes: ["id", "username", "displayName", "userImage", "bio"],
        },
        {
          model: User,
          as: "Following",
          through: { attributes: [] },
          attributes: ["id", "username", "displayName", "userImage", "bio"],
        },
        {
          model: Post,
          as: "posts",
          attributes: ["id"],
        },
        {
          model: Post,
          as: "savedPostsList",
          through: { attributes: [] },
          attributes: ["id"],
        },
      ],
    });

    return userInfo || null;
  }

  async register({ email, password, displayName, username }) {
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Sequelize.Op.or]: [{ email }],
      },
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Auto-generate username if not provided
    const finalUsername = username || (await genUniqueUserName(email));

    // Hash the password and create a new user
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newUser = await User.create({
      username: finalUsername,
      displayName: displayName || finalUsername,
      email,
      password: hashedPassword,
      signedWith: "manual",
    });

    // Add new username to Bloom Filter
    bloomFilter.add(finalUsername);

    // Remove password before returning
    const userData = newUser.get({ plain: true });
    delete userData.password;

    return userData;
  }

  // Login existing user
  async login({ email, password }) {
    const user = await User.findOne({ where: { email } });
    if (!user) throw new Error("User not found");

    if (user.signedWith && user.signedWith !== "manual") {
      throw new Error(
        `This account is registered using ${user.signedWith}. Please login with ${user.signedWith} instead.`
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    const userData = user.get({ plain: true });
    delete userData.password;

    return userData;
  }
}

export default new UserService();
