import { User } from "../models/user.model.js";
import { ApiError } from "../utils/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

// This is the core middleware for authentication.
// It will be used to protect routes that require a user to be logged in.
export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        // Step 1: Extract the access token from the request.
        // A client can send the token in two ways:
        // - In a cookie named 'accessToken'.
        // - In the 'Authorization' header as a 'Bearer' token.
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        // Step 2: Check if the token exists.
        // If no token is found, the user is not authenticated.
        if (!token) {
            throw new ApiError(401, "Unauthorized request. Token not found.");
        }

        // Step 3: Verify the token using the secret key.
        // The `jwt.verify` function decodes the token. If the token is invalid
        // (e.g., expired, or the signature doesn't match), it will throw an error.
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Step 4: Find the user in the database using the ID from the decoded token.
        // We select all fields except the password and refresh token for security.
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // Step 5: Check if the user exists.
        // It's possible the token is valid, but the user has been deleted.
        if (!user) {
            throw new ApiError(401, "Invalid Access Token. User not found.");
        }

        // Step 6: Attach the user object to the request.
        // This makes the authenticated user's details available in all subsequent
        // route handlers (e.g., in your controllers, you can access `req.user`).
        req.user = user;
        
        // Step 7: Pass control to the next middleware or route handler.
        next();
    } catch (error) {
        // This catch block handles errors from jwt.verify (like token expiration)
        // and any other errors that might occur.
        throw new ApiError(401, error?.message || "Invalid access token.");
    }
});