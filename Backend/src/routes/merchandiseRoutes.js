import express from "express";
import { getProducts } from "../controller/merchandiseController.js";

const router = express.Router();

// GET all products with optional query params: category, sort, search
router.get("/", getProducts);

export default router;