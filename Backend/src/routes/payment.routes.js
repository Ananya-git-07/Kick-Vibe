import { Router } from "express";
import { createPaymentIntent } from "../controllers/payment.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// All payment routes require a user to be logged in
router.use(verifyJWT);

router.route("/create-intent").post(createPaymentIntent);

export default router;