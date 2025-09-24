import { Router } from "express";
import passport from "../config/passport.js"; // Import our configured Passport
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/errorHandler.js";

const router = Router();

// Helper function to generate tokens (copied from your user.controller for modularity)
const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

// Route 1: The endpoint to kick off the Google authentication process
// The user's browser will be redirected to Google's login page.
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);


// Route 2: The callback URL that Google redirects to after authentication
// Passport will handle the code exchange and run our "verify" callback from passport.js
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false, // We are using JWT, not sessions
        failureRedirect: "/login-failure", // A route to redirect to if login fails (optional)
    }),
    // This is the final handler that runs ONLY on successful authentication
    asyncHandler(async (req, res) => {
        // The user object is attached to req.user by the Passport "verify" callback
        const user = req.user;

        // 1. Generate our own JWT tokens for the user
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        // 2. Set the tokens in cookies
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        };

        // 3. Prepare the user data to be sent back (without sensitive info)
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        // 4. Send the response and redirect the user back to the frontend
        // IMPORTANT: Change 'http://localhost:3000' to your actual frontend domain
        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .redirect(process.env.CORS_ORIGIN || 'http://localhost:5173');
    })
);

export default router;