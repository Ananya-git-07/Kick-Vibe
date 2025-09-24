import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";
import crypto from "crypto";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/api/v1/auth/google/callback", // Must match the one in Google Console
            scope: ["profile", "email"],
        },
        // This is the "verify" callback function that runs after Google authenticates the user
        async (accessToken, refreshToken, profile, done) => {
            try {
                // 1. Find a user with the Google profile email
                let user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // 2a. If user exists, they are logging in.
                    // We don't need to do anything with the user document here.
                    // Just pass the user object to the next step.
                    return done(null, user);
                } else {
                    // 2b. If user does not exist, they are signing up.
                    // Create a new user in our database.
                    const newUser = await User.create({
                        fullName: profile.displayName,
                        email: profile.emails[0].value,
                        // Generate a username from the email (e.g., 'john.doe' from 'john.doe@gmail.com')
                        // and add random numbers to ensure it's unique
                        username: profile.emails[0].value.split('@')[0] + Math.floor(Math.random() * 10000),
                        avatar: profile.photos[0].value, // Use the Google profile picture as avatar
                        // Since they are using Google, they don't have a password with us.
                        // We will create a random, secure password that they will never use.
                        password: crypto.randomBytes(20).toString('hex'),
                    });

                    return done(null, newUser);
                }
            } catch (error) {
                return done(error, false, { message: "Error in Google OAuth strategy." });
            }
        }
    )
);

// Note: We are not using sessions, so we don't need to serialize/deserialize the user.
// The JWT approach is stateless.

export default passport;