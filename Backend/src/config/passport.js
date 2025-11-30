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
            passReqToCallback: true, // Enable access to the request object
        },
        // This is the "verify" callback function that runs after Google authenticates the user
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                const isSignup = req.query.state === 'signup';
                
                // 1. Find a user with the Google profile email
                let user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    if (isSignup) {
                        // User already exists and they're trying to sign up
                        // In this case, we'll just log them in instead of rejecting
                        // This provides better UX - they get logged in rather than seeing an error
                        return done(null, user);
                    }
                    // 2. User exists and they're trying to log in - allow it
                    return done(null, user);
                } else {
                    if (isSignup) {
                        // 3. User doesn't exist and they're trying to sign up - create account
                        const newUser = await User.create({
                            fullName: profile.displayName,
                            email: profile.emails[0].value,
                            username: profile.emails[0].value.split('@')[0] + Math.floor(Math.random() * 10000),
                            avatar: profile.photos[0].value,
                            password: crypto.randomBytes(20).toString('hex'),
                        });
                        return done(null, newUser);
                    } else {
                        // 4. User doesn't exist and they're trying to log in - reject
                        return done(null, false, { 
                            message: "No account found with this email. Please sign up first." 
                        });
                    }
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