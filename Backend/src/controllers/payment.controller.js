import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";
import stripePackage from "stripe";

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // 1. Find the user's cart and calculate the total amount
    const cart = await Cart.findOne({ owner: userId }).populate("items.shoe");

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cannot create payment intent for an empty cart.");
    }

    const amountInPaisa = Math.round(cart.cartTotalPrice * 100); // Stripe expects the amount in the smallest currency unit (e.g., paisa for INR)

    // 2. Create a Payment Intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInPaisa,
        currency: "inr",
        // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
        automatic_payment_methods: {
            enabled: true,
        },
    });

    // 3. Send the client_secret back to the frontend
    res.status(200).json(new ApiResponse(
        200,
        { clientSecret: paymentIntent.client_secret },
        "Payment intent created successfully."
    ));
});

export { createPaymentIntent };