import mongoose, { Schema } from "mongoose";

const shoeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        description: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true,
            min: 0
        },
        brand: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true,
            enum: ["sneakers", "boots", "sandals", "formal", "casual"]
        },
        sizes: {
            type: [String],
            required: true
        },
        images: [
            {
                type: String,
                required: true
            }
        ],
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 1
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        averageRating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
            set: (val) => Math.round(val * 10) / 10
        },
        numberOfReviews: {
            type: Number,
            default: 0
        },

        // ADD THIS NEW FIELD
        isFeatured: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true
    }
);

// Keep the existing text index
shoeSchema.index({
    name: 'text',
    brand: 'text',
    description: 'text'
});


export const Shoe = mongoose.model("Shoe", shoeSchema);