import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema({
    shoe: {
        type: Schema.Types.ObjectId,
        ref: "Shoe",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    size: {
        type: String,
        required: true,
    }
});

const cartSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true, // Each user has one cart
        },
        items: [cartItemSchema],
    },
    {
        timestamps: true,
        // Add a virtual to calculate the total price of the cart
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

// We need to populate the 'shoe' field to calculate the subtotal
cartSchema.virtual('cartTotalPrice').get(function() {
    return this.items.reduce((total, item) => {
        // This assumes that the 'shoe' field is populated
        if (item.shoe && item.shoe.price) {
            return total + (item.shoe.price * item.quantity);
        }
        return total;
    }, 0);
});


export const Cart = mongoose.model("Cart", cartSchema);