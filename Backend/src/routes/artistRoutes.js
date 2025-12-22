import express from "express";
import { AddEvent, GetrequestedEvent } from "../controller/eventController.js";
import upload from "../Config/multer.js";
import { artistOnly } from "../middleware/Artistonly.js";

const router= express.Router()
router.get("/request",artistOnly,GetrequestedEvent);
router.post("/request",upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'images', maxCount: 10 }
]), artistOnly,AddEvent);
export default router