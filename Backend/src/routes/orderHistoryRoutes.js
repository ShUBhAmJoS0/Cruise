import express from "express";
import { getOrderHistory, getOrderById, deleteOrder, getOrderStats, } from "../controller/orderHistoryController.js";

const router = express.Router();

router.get("/", getOrderHistory);
router.get("/stats", getOrderStats);
router.get("/:id", getOrderById);
router.delete("/:id", deleteOrder);

export default router;