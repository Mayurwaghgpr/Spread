import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.js"; // Adjust the path as necessary
import dotenv from "dotenv";
import Post from "../models/posts.js";
import genUniqueUserName from "../utils/UserNameGenerator.js";
import Sequelize from "sequelize";
dotenv.config();

export const passportStrategies = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log({profile})
        try {
          if (!profile) {
            return;
          }
          let user = await User.findOne({
            where: { [Sequelize.Op.and]: [{ email: profile.email }, { signedWith: profile.provider }] },
            include: [
              {
                model: User,
                as: "Followers",
                through: { attributes: { exclude: ["password"] } },
              },
              {
                model: User,
                as: "Following",
                through: { attributes: { exclude: ["password"] } },
              },
              {
                model: Post,
                attributes: ['id']
              },
              {
                model: Post,
                as: 'savedPosts',
                through: { attributes: [] }, // Fetch only related posts
              },
            ],
            
            
          });

          if (!user) {
            const username = await genUniqueUserName( profile.email);
            user = await User.create({
              username: username,
              displayName: profile.displayName,
              email: profile.email,
              userImage: profile.picture,
              password: profile.id,
              signedWith: profile.provider,
            });
          }
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        // console.log(profile)

        try {
          if (!profile) {
            return;
          }
          let user = await User.findOne({
            where: { [Sequelize.Op.and]: [{ username: profile.username } ,{signedWith: profile.provider}]},
            include: [
              {
                model: User,
                as: "Followers",
                through: { attributes: { exclude: ["password"] } },
              },
              {
                model: User,
                as: "Following",
                through: { attributes: { exclude: ["password"] } },
              },
               {
                model: Post,
                // as: 'userPosts',
                attributes: ['id']
               },
                   {
                model: Post,
                as: 'savedPosts',
                through: { attributes: [] }, // Fetch only related posts
              },
            ],
          });
          if (!user) {
            user = await User.create({
              username: profile.username,
              displayName:profile.displayName,
              email: profile.emails[0].value,
              userImage: profile._json.avatar_url,
              bio: profile._json.bio,
              signedWith: profile.provider,
              password: profile?.id,
            });
          }
          done(null, user);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};
