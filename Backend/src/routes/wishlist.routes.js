import { Router } from "express";
import { toggleWishlistItem, getWishlist } from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router.route("/").get(getWishlist);
router.route("/toggle/:shoeId").post(toggleWishlistItem);

export default router;