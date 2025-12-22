
import express from "express";
import {DisplayAll, GetEvent, GetrequestedEvent } from "../controller/eventController.js";

const router= express.Router()


router.get("/",DisplayAll);
router.get("/:id",GetEvent);
export default router
