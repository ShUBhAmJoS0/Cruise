import express from "express";
import { createReview, getArtistReviews, getAllReviews, deleteReview } from "../controller/reviewController.js";
import { AttendeeOnly } from "../middleware/Attendeonly.js";
import { artistOnly } from "../middleware/Artistonly.js";

const router = express.Router();

router.post("/", AttendeeOnly, createReview);
router.get("/artist/:artistId", getArtistReviews);
router.get("/all", artistOnly, getAllReviews);
router.delete("/:reviewId", AttendeeOnly, deleteReview);

export default router;
