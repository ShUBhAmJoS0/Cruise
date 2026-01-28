import express from "express";
import { getOrderHistory, getOrderById, cancelOrder, getOrderStats, } from "../controller/orderHistoryController.js";

const router = express.Router();

router.get("/", getOrderHistory);
router.get("/stats", getOrderStats);
router.get("/:id", getOrderById);
router.put("/:id/cancel", cancelOrder);

export default router;