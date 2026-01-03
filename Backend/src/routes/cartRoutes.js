import express from "express";
import { addToCart, removeCartItem, updateCartQuantity, viewCart } from "../controller/cartController.js";
import { buySingleItem, buyAllCartItems } from "../controller/orderController.js";

const router = express.Router();

router.post("/", addToCart);
router.get("/", viewCart);
router.put("/:cartItemId", updateCartQuantity);
router.delete("/:cartItemId", removeCartItem);
router.post("/order/single", buySingleItem);
router.post("/order/cart", buyAllCartItems);
export default router;