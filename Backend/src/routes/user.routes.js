import { Router } from "express";
import {
    loginUser,
    logoutUser,
    registerUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// This route handles new user registration.
// It uses the 'upload' middleware from Multer to handle multipart/form-data,
// specifically for uploading an avatar and a cover image.
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

// This route handles user login.
router.route("/login").post(loginUser);


// -- Secured Routes --
// The 'verifyJWT' middleware will be applied to all routes defined below this point.
// This ensures that only authenticated users can access these endpoints.

// This route handles user logout. It requires the user to be logged in.
router.route("/logout").post(verifyJWT, logoutUser);

// This route allows a logged-in user to request a new access token using a refresh token.
router.route("/refresh-token").post(refreshAccessToken);

// This route allows a logged-in user to change their password.
router.route("/change-password").post(verifyJWT, changeCurrentPassword);

// This route allows a logged-in user to get their own profile information.
router.route("/current-user").get(verifyJWT, getCurrentUser);

// This route allows a logged-in user to update their account details (e.g., fullName, email).
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

// This route allows a logged-in user to update their avatar image.
// It uses the 'upload' middleware to handle the new image file.
router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

// This route allows a logged-in user to update their cover image.
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);


export default router;