import { Router } from "express";
import {
    getCart,
    addItemToCart,
    updateItemInCart,
    removeItemFromCart
} from "../controllers/cart.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router.route("/").get(getCart);
router.route("/add").post(addItemToCart);
router.route("/item/:itemId").patch(updateItemInCart);
router.route("/item/:itemId").delete(removeItemFromCart);

export default router;