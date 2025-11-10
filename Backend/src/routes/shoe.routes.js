import { Router } from "express";
import {
    addShoe,
    getAllShoes,
    getShoeById,
    updateShoe,
    deleteShoe,
    searchShoes,
    getNewArrivals,
    getFeaturedShoes
} from "../controllers/shoe.controller.js";
import { upload } from "../middleware/multer.middleware.js";
// --- MODIFIED IMPORT ---
import { verifyJWT } from "../middleware/auth.middleware.js"; 

const router = Router();

// --- Public Routes ---
router.route("/new-arrivals").get(getNewArrivals);
router.route("/featured").get(getFeaturedShoes);
router.route("/search").get(searchShoes);
router.route("/").get(getAllShoes);
router.route("/:id").get(getShoeById);

// --- Secured Admin Routes ---
// --- REPLACED THE MIDDLEWARES HERE ---
router.route("/add").post(
    verifyJWT, // <-- Use the regular JWT middleware
    upload.fields([ { name: 'images', maxCount: 5 } ]),
    addShoe
);

router.route("/:id")
    .patch(
        verifyJWT, // <-- Use the regular JWT middleware
        updateShoe
    )
    .delete(
        verifyJWT, // <-- Use the regular JWT middleware
        deleteShoe
    );

export default router;