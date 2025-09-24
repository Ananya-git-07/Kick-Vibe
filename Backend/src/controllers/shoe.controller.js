import {asyncHandler} from "../utils/asyncHandler.js";

import { ApiError } from "../utils/errorHandler.js";
import { Shoe } from "../models/shoe.model.js";

import { uploadOnCloudinary } from "../utils/Cloudinary.js";  // ✅ better
  // ✅ correct
 // ✅ correct

import { ApiResponse } from "../utils/ApiResponse.js";

// Controller to add a new shoe
const addShoe = asyncHandler(async (req, res) => {
    // --- THIS IS THE DEBUGGING LINE ---
    console.log("DATA RECEIVED BY CONTROLLER:", req.body); 
    // ------------------------------------

    const { name, description, price, brand, category, sizes, stock } = req.body;

    if (!name || !description || !price || !brand || !category || !sizes) {
        throw new ApiError(400, "All fields except stock are required");
    }

    const imageFiles = req.files?.images;
    if (!imageFiles || imageFiles.length === 0) {
        throw new ApiError(400, "At least one image is required");
    }

    const imageUrls = [];
    for (const file of imageFiles) {
        const cloudinaryResponse = await uploadOnCloudinary(file.path);
        if (cloudinaryResponse) {
            imageUrls.push(cloudinaryResponse.url);
        }
    }

    if (imageUrls.length === 0) {
        throw new ApiError(500, "Error uploading images");
    }

    const shoe = await Shoe.create({
        name,
        description,
        price,
        brand,
        category,
        sizes: sizes.split(","), // Assuming sizes are comma-separated string
        images: imageUrls,
        stock,
        owner: req.user._id,
    });

    return res.status(201).json(new ApiResponse(201, shoe, "Shoe added successfully"));
});


  

// Controller to get all shoes with filtering and pagination
const getAllShoes = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, brand, category, minPrice, maxPrice } = req.query;
    const query = {};

    if (brand) query.brand = brand;
    if (category) query.category = category;
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = minPrice;
        if (maxPrice) query.price.$lte = maxPrice;
    }

    const shoes = await Shoe.find(query)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    const count = await Shoe.countDocuments(query);

    return res.status(200).json(new ApiResponse(200, {
        shoes,
        totalPages: Math.ceil(count / limit),
        currentPage: page
    }, "Shoes retrieved successfully"));
});

// Controller to get a single shoe by ID
const getShoeById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const shoe = await Shoe.findById(id);

    if (!shoe) {
        throw new ApiError(404, "Shoe not found");
    }

    return res.status(200).json(new ApiResponse(200, shoe, "Shoe retrieved successfully"));
});

// Controller to update a shoe
const updateShoe = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const shoe = await Shoe.findById(id);

    if (!shoe) {
        throw new ApiError(404, "Shoe not found");
    }
    
    // Add authorization check: only the owner can update
    if (shoe.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this shoe");
    }

        const { name, description, price, brand, category, sizes, stock, isFeatured } = req.body;

    // 2. Create an update object with these fields.
    const updateData = {
        name,
        description,
        price,
        brand,
        category,
        sizes,
        stock,
        isFeatured
    };

    // 3. (Optional but recommended) Remove any undefined properties from the update object
    // so you don't accidentally overwrite existing values with null.
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    // 4. Perform the update with the sanitized data object.
    const updatedShoe = await Shoe.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
    );

    return res.status(200).json(new ApiResponse(200, updatedShoe, "Shoe updated successfully"));
});

// Controller to delete a shoe
const deleteShoe = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const shoe = await Shoe.findById(id);

    if (!shoe) {
        throw new ApiError(404, "Shoe not found");
    }

    // Add authorization check: only the owner can delete
    if (shoe.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this shoe");
    }

    await Shoe.findByIdAndDelete(id);

    return res.status(200).json(new ApiResponse(200, {}, "Shoe deleted successfully"));
});


const searchShoes = asyncHandler(async (req, res) => {
    const { q } = req.query;

    if (!q) {
        throw new ApiError(400, "Search query 'q' is required.");
    }

    const shoes = await Shoe.find(
        { $text: { $search: q } },
        { score: { $meta: "textScore" } } // project a 'score' field for relevance
    ).sort({ score: { $meta: "textScore" } }); // sort by relevance

    if (!shoes.length) {
        return res.status(404).json(new ApiResponse(404, [], "No shoes found matching your search."));
    }

    return res.status(200).json(new ApiResponse(200, shoes, "Search results retrieved successfully."));
});

const getNewArrivals = asyncHandler(async (req, res) => {
    const newArrivals = await Shoe.find()
        .sort({ createdAt: -1 }) // The -1 makes it sort from newest to oldest
        .limit(10); // Limit to the top 10 newest products

    return res.status(200).json(new ApiResponse(200, newArrivals, "New arrivals retrieved successfully."));
});


const getFeaturedShoes = asyncHandler(async (req, res) => {
    const featuredShoes = await Shoe.find({ isFeatured: true })
        .limit(10); // Limit to 10 featured products

    return res.status(200).json(new ApiResponse(200, featuredShoes, "Featured products retrieved successfully."));
});


// ADD THE NEW FUNCTION TO THE EXPORTS
export {
    addShoe,
    getAllShoes,
    getShoeById,
    updateShoe,
    deleteShoe,
    searchShoes,
    getNewArrivals,     // Add this export
    getFeaturedShoes    // Add this export
};


