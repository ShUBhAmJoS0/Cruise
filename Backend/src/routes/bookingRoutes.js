// backend/src/routes/bookingRoutes.js
import express from "express";
import { createBookingController, Getmybookings } from "../controller/bookingController.js";
import { AttendeeOnly } from "../middleware/Attendeonly.js";

const router = express.Router();

router.post("/", AttendeeOnly, createBookingController);
router.get("/",AttendeeOnly,Getmybookings) 

export default router;
