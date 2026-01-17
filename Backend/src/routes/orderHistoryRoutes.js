import express from "express";
import { getUserOrders, getOrderById, createOrder, updateOrderStatus, cancelOrder, } from "../controller/orderHistoryController.js";

const router = express.Router();

router.get("/user/:userId", getUserOrders);
router.get("/:orderId", getOrderById);
router.post("/", createOrder);
router.put("/:orderId/status", updateOrderStatus);
router.put("/:orderId/cancel", cancelOrder);

export default router;