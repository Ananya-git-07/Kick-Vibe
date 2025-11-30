import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/user.model.js";
import crypto from "crypto";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.BACKEND_URL || 'http://localhost:8000'}/api/v1/auth/google/callback`,
            scope: ["profile", "email"],
        },
        // This is the "verify" callback function that runs after Google authenticates the user
        async (accessToken, refreshToken, profile, done) => {
            try {
                // 1. Find a user with the Google profile email
                let user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // 2. If user exists, they can log in.
                    return done(null, user);
                } else {
                    // 3. If user does not exist, reject the login attempt.
                    // They need to register first using the regular signup flow.
                    return done(null, false, { 
                        message: "No account found with this email. Please sign up first." 
                    });
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