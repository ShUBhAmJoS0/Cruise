import express from "express";
import { checkout } from "../controller/orderController.js";
import authToken from "../middleware/firebaseAuth.js";

const router = express.Router();

router.use(authToken);

router.post("/checkout", checkout);

export default router;
