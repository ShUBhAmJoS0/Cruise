import express from "express";
import { addToCart, getCart, updateCartItem, removeCartItem } from "../controller/cartController.js";
import authToken from "../middleware/firebaseAuth.js";

const router = express.Router();

router.use(authToken);

router.post("/", addToCart);             
router.get("/", getCart);               
router.patch("/:itemId", updateCartItem); 
router.delete("/:itemId", removeCartItem); 

export default router;
