import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.model.js"; // Adjust the path as necessary
import dotenv from "dotenv";
import genUniqueUserName from "../utils/UserNameGenerator.js";

import passport from "passport";
import userService from "../services/user.service.js";

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
          console.log("Google OAuth Profile received:", profile);
          
          if (!profile) {
            console.error("No profile received from Google");
            return done(new Error("No profile received from Google"));
          }
          
          const { email, provider, displayName, picture, id } = profile;
          
          if (!email) {
            console.error("No email in Google profile");
            return done(new Error("Email not provided by Google"));
          }
          
          console.log(`Looking for user with email: ${email}, provider: ${provider}`);
          
          let user = await userService.finduser({
            email,
            signedWith: provider,
          });
          
          if (!user) {
            console.log("User not found, creating new user");
            const username = await genUniqueUserName(profile.email);
            user = await User.create({
              username: username,
              displayName: displayName,
              email: email,
              userImage: picture,
              password: id,
              signedWith: provider,
            });
            console.log("New user created:", user.id);
          } else {
            console.log("Existing user found:", user.id);
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
          
          // Extract email and provider from profile
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
          const provider = profile.provider;
          
          if (!email) {
            return done(new Error("Email not provided by GitHub"));
          }
          
          let user = await userService.finduser({
            email,
            signedWith: provider,
          });
          if (!user) {
            user = await User.create({
              username: profile.username,
              displayName: profile.displayName,
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
