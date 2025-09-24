
import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema({
    shoeId: {
        type: Schema.Types.ObjectId,
        ref: "Shoe",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    price: {
        type: Number, // Storing price at the time of order
        required: true,
    },
    size: {
        type: String,
        required: true
    },
    name: {
        type: String, // Storing name at the time of order
        required: true
    }
});

const orderSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [orderItemSchema],
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        shippingAddress: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
        },
        paymentDetails: {
            paymentId: { type: String },
            paymentMethod: {
                type: String,
                enum: ["Credit Card", "PayPal", "Stripe"], // Example payment methods
                required: true
            },
            paymentStatus: {
                type: String,
                enum: ["pending", "completed", "failed"],
                default: "pending",
                required: true
            }
        },
        orderStatus: {
            type: String,
            required: true,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

export const Order = mongoose.model("Order", orderSchema);