import express from "express";
import {  getAllMerch} from "../controller/ProductController.js";
import { markOrderAsComplete } from "../controller/orderController.js";
import { AttendeeOnly } from "../middleware/Attendeonly.js";
import { artistOnly } from "../middleware/Artistonly.js";

const router = express.Router();

router.get("/", AttendeeOnly, getAllMerch);
router.put("/complete/:id", artistOnly, markOrderAsComplete);

export default router;
