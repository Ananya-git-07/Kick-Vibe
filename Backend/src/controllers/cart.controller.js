import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errorHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Cart } from "../models/cart.model.js";
import { Shoe } from "../models/shoe.model.js";
import mongoose from "mongoose";


// Controller to get the user's cart
const getCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    // Find the cart and populate shoe details
    const cart = await Cart.findOne({ owner: userId }).populate({
        path: 'items.shoe',
        model: 'Shoe'
    });

    if (!cart) {
        // If no cart exists, create one for the user
        const newCart = await Cart.create({ owner: userId, items: [] });
        return res.status(200).json(new ApiResponse(200, newCart, "Cart is empty. Created a new one for the user."));
    }
    
    // Recalculate total price in case of price changes (optional but good practice)
    await cart.save();


    return res.status(200).json(new ApiResponse(200, cart, "User cart retrieved successfully."));
});


// Controller to add an item to the cart
const addItemToCart = asyncHandler(async (req, res) => {
    const { shoeId, quantity, size } = req.body;
    const userId = req.user._id;

    if (!shoeId || !quantity || !size) {
        throw new ApiError(400, "Shoe ID, quantity, and size are required.");
    }
    
    // Check if the shoe exists and has enough stock
    const shoe = await Shoe.findById(shoeId);
    if (!shoe) {
        throw new ApiError(404, "Shoe not found.");
    }
    if (shoe.stock < quantity) {
        throw new ApiError(400, `Not enough stock. Only ${shoe.stock} items available.`);
    }

    // Find the user's cart
    let cart = await Cart.findOne({ owner: userId });

    // If no cart, create one
    if (!cart) {
        cart = await Cart.create({ owner: userId, items: [] });
    }

    // Check if the item with the same shoeId and size already exists in the cart
    const existingItemIndex = cart.items.findIndex(item => item.shoe.toString() === shoeId && item.size === size);

    if (existingItemIndex > -1) {
        // If item exists, update the quantity
        cart.items[existingItemIndex].quantity += parseInt(quantity, 10);
    } else {
        // If item doesn't exist, add it to the cart
        cart.items.push({ shoe: shoeId, quantity, size });
    }

    await cart.save();
    
    const populatedCart = await Cart.findById(cart._id).populate('items.shoe');

    return res.status(200).json(new ApiResponse(200, populatedCart, "Item added to cart successfully."));
});


// Controller to update item quantity in cart
const updateItemInCart = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (!quantity || quantity < 1) {
        throw new ApiError(400, "A valid quantity is required.");
    }

    const cart = await Cart.findOne({ owner: userId });
    if (!cart) {
        throw new ApiError(404, "Cart not found.");
    }
    
    // Find the item in the cart
    const itemToUpdate = cart.items.id(itemId);
    if (!itemToUpdate) {
        throw new ApiError(404, "Item not found in cart.");
    }
    
    // Check for stock
    const shoe = await Shoe.findById(itemToUpdate.shoe);
     if (shoe.stock < quantity) {
        throw new ApiError(400, `Not enough stock. Only ${shoe.stock} items available.`);
    }

    itemToUpdate.quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate('items.shoe');

    return res.status(200).json(new ApiResponse(200, populatedCart, "Cart item updated successfully."));
});


// Controller to remove an item from the cart
const removeItemFromCart = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const userId = req.user._id;

    const cart = await Cart.findOneAndUpdate(
        { owner: userId },
        { $pull: { items: { _id: itemId } } },
        { new: true }
    ).populate('items.shoe');

    if (!cart) {
        throw new ApiError(404, "Cart not found or item not in cart.");
    }

    return res.status(200).json(new ApiResponse(200, cart, "Item removed from cart successfully."));
});


export {
    getCart,
    addItemToCart,
    updateItemInCart,
    removeItemFromCart
};