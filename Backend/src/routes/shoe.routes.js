import { Router } from "express";
import {
    addShoe,
    getAllShoes,
    getShoeById,
    updateShoe,
    deleteShoe,
    searchShoes,
    getNewArrivals,     // Import the new function
    getFeaturedShoes    // Import the new function
} from "../controllers/shoe.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// --- Public Routes ---

// ADD THE TWO NEW ROUTES HERE
router.route("/new-arrivals").get(getNewArrivals);
router.route("/featured").get(getFeaturedShoes);


router.route("/search").get(searchShoes);
router.route("/").get(getAllShoes);
router.route("/:id").get(getShoeById);


// --- Secured Routes (require login) ---
router.use(verifyJWT);

router.route("/add").post(
    upload.fields([
        {
            name: 'images',
            maxCount: 5
        }
    ]),
    addShoe
);

router.route("/:id").patch(updateShoe).delete(deleteShoe);

export default router;