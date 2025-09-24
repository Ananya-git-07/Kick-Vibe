import mongoose, { Schema } from "mongoose";
import { Shoe } from "./shoe.model.js";

const reviewSchema = new Schema(
    {
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            trim: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        shoe: {
            type: Schema.Types.ObjectId,
            ref: "Shoe",
            required: true,
        },
    },
    {
        timestamps: true
    }
);

// Static method to calculate the average rating on a shoe
reviewSchema.statics.calculateAverageRating = async function(shoeId) {
    const stats = await this.aggregate([
        {
            $match: { shoe: shoeId }
        },
        {
            $group: {
                _id: '$shoe',
                numberOfReviews: { $sum: 1 },
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        if (stats.length > 0) {
            await Shoe.findByIdAndUpdate(shoeId, {
                numberOfReviews: stats[0].numberOfReviews,
                averageRating: stats[0].averageRating
            });
        } else {
            // If no reviews, reset to defaults
            await Shoe.findByIdAndUpdate(shoeId, {
                numberOfReviews: 0,
                averageRating: 0
            });
        }
    } catch (error) {
        console.error(error);
    }
};

// Call the calculateAverageRating method after saving a review
reviewSchema.post('save', function() {
    this.constructor.calculateAverageRating(this.shoe);
});

// Call the calculateAverageRating method after removing a review
reviewSchema.post('remove', function() {
    this.constructor.calculateAverageRating(this.shoe);
});


export const Review = mongoose.model("Review", reviewSchema);