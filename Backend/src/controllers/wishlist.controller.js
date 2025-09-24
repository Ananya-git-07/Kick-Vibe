import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Shoe } from "../models/shoe.model.js";
import mongoose from "mongoose";

// Controller to add or remove an item from the wishlist
const toggleWishlistItem = asyncHandler(async (req, res) => {
    const { shoeId } = req.params;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(shoeId)) {
        throw new ApiError(400, "Invalid Shoe ID.");
    }

    const shoe = await Shoe.findById(shoeId);
    if (!shoe) {
        throw new ApiError(404, "Shoe not found.");
    }

    const user = await User.findById(userId);
    
    // Check if the shoe is already in the wishlist
    const wishlistedIndex = user.wishlist.findIndex(id => id.toString() === shoeId);

    if (wishlistedIndex > -1) {
        // If it exists, remove it ($pull)
        user.wishlist.splice(wishlistedIndex, 1);
        await user.save({ validateBeforeSave: false });
        return res.status(200).json(new ApiResponse(200, { isWishlisted: false }, "Item removed from wishlist."));
    } else {
        // If it doesn't exist, add it ($push)
        user.wishlist.push(shoeId);
        await user.save({ validateBeforeSave: false });
        return res.status(200).json(new ApiResponse(200, { isWishlisted: true }, "Item added to wishlist."));
    }
});

// Controller to get the user's wishlist
const getWishlist = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const user = await User.findById(userId).populate("wishlist");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res.status(200).json(new ApiResponse(200, user.wishlist, "Wishlist retrieved successfully."));
});

export {
    toggleWishlistItem,
    getWishlist
};