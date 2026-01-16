import express from "express";
import {  getAllMerch} from "../controller/ProductController.js";
import { AttendeeOnly } from "../middleware/Attendeonly.js";

const router = express.Router();

router.get("/", AttendeeOnly, getAllMerch);

export default router;
