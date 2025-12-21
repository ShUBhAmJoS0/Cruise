// backend/src/routes/EventRoutes.js

import express from "express";
import { AddEvent, DisplayAll, GetEvent } from "../controller/eventController.js";

const router= express.Router()


router.get("/",DisplayAll);
router.get("/:id",GetEvent);
router.post("/request", AddEvent);
router.get("/request",GetrequestedEvent);
export default router
