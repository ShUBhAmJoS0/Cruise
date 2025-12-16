// backend/src/routes/EventRoutes.js

import express from "express";
import { DisplayAll, GetEvent } from "../controller/eventController.js";

const router= express.Router()


router.get("/",DisplayAll);
router.get("/:id",GetEvent);
export default router
