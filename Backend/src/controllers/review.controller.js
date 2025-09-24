import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";
import { Order } from "../models/order.model.js";
import { Shoe } from "../models/shoe.model.js";

// Controller to create a new review
const createReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const { shoeId } = req.params;
    const userId = req.user._id;
    
    // 1. Check if the shoe exists
    const shoe = await Shoe.findById(shoeId);
    if (!shoe) {
        throw new ApiError(404, "Shoe not found.");
    }
    
    // 2. Check if the user has purchased this shoe
    const hasPurchased = await Order.findOne({
        "owner": userId,
        "items.shoeId": shoeId,
        "orderStatus": "delivered" // Optional: only allow reviews for delivered orders
    });
    if (!hasPurchased) {
        throw new ApiError(403, "You can only review products you have purchased.");
    }

    // 3. Check if the user has already reviewed this shoe
    const existingReview = await Review.findOne({ user: userId, shoe: shoeId });
    if (existingReview) {
        throw new ApiError(409, "You have already submitted a review for this product.");
    }
    
    // 4. Create the review
    const review = await Review.create({
        rating,
        comment,
        shoe: shoeId,
        user: userId,
    });

    return res.status(201).json(new ApiResponse(201, review, "Review submitted successfully."));
});

// Controller to get all reviews for a specific shoe
const getShoeReviews = asyncHandler(async (req, res) => {
    const { shoeId } = req.params;
    const reviews = await Review.find({ shoe: shoeId }).populate("user", "username avatar");
    
    return res.status(200).json(new ApiResponse(200, reviews, "Reviews retrieved successfully."));
});

// Controller to delete a review
const deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
        throw new ApiError(404, "Review not found.");
    }

    // Check if the logged-in user is the owner of the review
    if (review.user.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to delete this review.");
    }

    await review.remove(); // Use remove() to trigger the 'post' middleware

    return res.status(200).json(new ApiResponse(200, {}, "Review deleted successfully."));
});

export { createReview, getShoeReviews, deleteReview };