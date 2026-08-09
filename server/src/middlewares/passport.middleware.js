import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import genUniqueUserName from "../utils/UserNameGenerator.js";
import passport from "passport";
import userService from "../services/user.service.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

dotenv.config();

export const passportStrategies = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          if (!profile) {
            return done(new Error("No profile received from Google"));
          }
          
          const { email, provider, displayName, picture } = profile;
          
          if (!email) {
            return done(new Error("Email not provided by Google"));
          }
          
          let user = await userService.finduser({
            email,
          });
          
          if (!user) {
            const username = await genUniqueUserName(email);
            const randomPassword = crypto.randomBytes(32).toString("hex");
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = await User.create({
              username: username,
              displayName: displayName || username,
              email: email,
              userImage: picture,
              password: hashedPassword,
              signedWith: provider,
            });
          }
          
          done(null, user);
        } catch (error) {
          console.error("Error in Google OAuth strategy:", error);
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
        try {
          if (!profile) {
            return done(new Error("No profile provided by GitHub"));
          }
          
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          const provider = profile.provider || "github";
          
          if (!email) {
            return done(new Error("Email not provided by GitHub"));
          }
          
          let user = await userService.finduser({
            email,
          });

          if (!user) {
            const username = profile.username || (await genUniqueUserName(email));
            const randomPassword = crypto.randomBytes(32).toString("hex");
            const hashedPassword = await bcrypt.hash(randomPassword, 10);

            user = await User.create({
              username: username,
              displayName: profile.displayName || username,
              email: email,
              userImage: profile._json?.avatar_url,
              bio: profile._json?.bio,
              signedWith: provider,
              password: hashedPassword,
            });
          }
          done(null, user);
        } catch (error) {
          console.error("Error in GitHub OAuth strategy:", error);
          done(error);
        }
      }
    )
  );
};
