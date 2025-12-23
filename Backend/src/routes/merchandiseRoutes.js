import express from "express";
import { getProducts } from "../controller/merchandiseController.js";
import { AttendeeOnly } from "../middleware/Attendeonly.js";

const router = express.Router();

router.get("/", AttendeeOnly, getProducts);

export default router;