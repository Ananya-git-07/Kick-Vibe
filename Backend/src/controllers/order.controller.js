import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { Shoe } from "../models/shoe.model.js";

// Controller to create a new order from the user's cart
const createOrder = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
        throw new ApiError(400, "Shipping address and payment method are required.");
    }

    // 1. Find the user's cart and populate shoe details
    const cart = await Cart.findOne({ owner: userId }).populate("items.shoe");

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Your cart is empty.");
    }

    let totalPrice = 0;
    const orderItems = [];
    const stockUpdates = [];

    // 2. Validate stock and prepare order items
    for (const item of cart.items) {
        const shoe = item.shoe;
        if (shoe.stock < item.quantity) {
            throw new ApiError(400, `Not enough stock for ${shoe.name}. Only ${shoe.stock} left.`);
        }
        
        totalPrice += item.quantity * shoe.price;
        
        orderItems.push({
            shoeId: shoe._id,
            quantity: item.quantity,
            price: shoe.price, // Price at the time of order
            size: item.size,
            name: shoe.name // Name at the time of order
        });
        
        // Prepare stock updates
        stockUpdates.push({
            updateOne: {
                filter: { _id: shoe._id },
                update: { $inc: { stock: -item.quantity } }
            }
        });
    }

    // 3. Create the order
    const order = await Order.create({
        owner: userId,
        items: orderItems,
        totalPrice,
        shippingAddress,
        paymentDetails: {
            paymentMethod,
            paymentStatus: 'pending' // Or integrate with a real payment gateway
        },
        orderStatus: 'pending'
    });
    
    if (!order) {
        throw new ApiError(500, "Something went wrong while creating the order.");
    }
    
    // 4. Update stock in bulk
    await Shoe.bulkWrite(stockUpdates);
    
    // 5. Clear the user's cart
    await Cart.findByIdAndUpdate(cart._id, { $set: { items: [] } });

    return res.status(201).json(new ApiResponse(201, order, "Order placed successfully."));
});

// Controller to get a user's order history
const getMyOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const orders = await Order.find({ owner: userId }).sort({ createdAt: -1 });

    if (!orders) {
        return res.status(200).json(new ApiResponse(200, [], "You have no orders yet."));
    }

    return res.status(200).json(new ApiResponse(200, orders, "Orders retrieved successfully."));
});

// Controller to get a single order by its ID
const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(orderId)) {
        throw new ApiError(400, "Invalid Order ID.");
    }

    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found.");
    }
    
    // Security check: ensure the user owns the order
    if (order.owner.toString() !== userId.toString()) {
        throw new ApiError(403, "You are not authorized to view this order.");
    }

    return res.status(200).json(new ApiResponse(200, order, "Order details retrieved successfully."));
});


export {
    createOrder,
    getMyOrders,
    getOrderById
};