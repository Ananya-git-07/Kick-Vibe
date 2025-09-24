import { Router } from "express";
import { createReview, getShoeReviews, deleteReview } from "../controllers/review.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Public route to get reviews for a shoe
router.route("/shoe/:shoeId").get(getShoeReviews);

// Secured Routes
router.use(verifyJWT);

router.route("/create/:shoeId").post(createReview);
router.route("/:reviewId").delete(deleteReview);

export default router;