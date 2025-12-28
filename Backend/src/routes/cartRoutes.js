import express from "express";
import { addToCart, updateCartItem, removeCartItem, getOrCreateCart } from "../controller/cartController.js";
import authToken from "../middleware/firebaseAuth.js";

const router = express.Router();

// All cart routes require authentication
router.use(authToken);

router.post("/", addToCart);
router.get("/", getOrCreateCart);
router.patch("/:itemId", updateCartItem);
router.delete("/:itemId", removeCartItem);

export default router;