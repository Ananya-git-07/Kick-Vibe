import { Router } from "express";
import { getAllOrders, getAllUsers, getDashboardStats } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Apply admin check to all routes in this file
// We'll use the in-controller check, so we just need to verify JWT here
router.use(verifyJWT); 

const checkAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden: Admin access required." });
    }
    next();
};

router.route("/stats").get(checkAdmin, getDashboardStats);

router.route("/orders").get(checkAdmin, getAllOrders);
router.route("/users").get(checkAdmin, getAllUsers);

export default router;