import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";

// Controller to get all orders in the system
const getAllOrders = asyncHandler(async (req, res) => {
    // We can add pagination later if needed
    const orders = await Order.find()
        .populate("owner", "fullName email") // Populate owner details
        .sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, orders, "All orders retrieved successfully."));
});

// Controller to get all users in the system
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken").sort({ createdAt: -1 });

    return res.status(200).json(new ApiResponse(200, users, "All users retrieved successfully."));
});

const getDashboardStats = asyncHandler(async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue by summing up the totalPrice of all orders
    const revenueStats = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalPrice" }
            }
        }
    ]);

    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;
    
    // Get the 5 most recent orders
    const recentOrders = await Order.find()
        .populate("owner", "fullName")
        .sort({ createdAt: -1 })
        .limit(5);

    const stats = {
        totalUsers,
        totalOrders,
        totalRevenue,
        recentOrders
    };

    return res.status(200).json(new ApiResponse(200, stats, "Dashboard stats retrieved successfully."));
});

export {
    getAllOrders,
    getAllUsers,
    getDashboardStats // <-- EXPORT THE NEW FUNCTION
};