import { Router } from "express";
import {
    createOrder,
    getMyOrders,
    getOrderById
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Apply verifyJWT middleware to all routes in this file
router.use(verifyJWT);

router.route("/").post(createOrder);
router.route("/history").get(getMyOrders);
router.route("/:orderId").get(getOrderById);

export default router;