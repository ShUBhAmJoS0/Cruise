import express from "express";
import { createReview, getArtistReviews, deleteReview } from "../controller/reviewController.js";
import { AttendeeOnly } from "../middleware/Attendeonly.js";

const router = express.Router();

router.post("/", AttendeeOnly, createReview);
router.get("/artist/:artistId", getArtistReviews);
router.delete("/:reviewId", AttendeeOnly, deleteReview);

export default router;
