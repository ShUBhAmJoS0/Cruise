// backend/src/routes/bookingRoutes.js
import express from "express";
import { createBookingController } from "../controller/bookingController.js";

const router = express.Router();

router.post("/", createBookingController); // POST /api/bookings

export default router;
