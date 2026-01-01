import express from "express";
import multer from "multer";
import {createCommunityPost, likePost, addComment, repostPost, getAllPosts, } from "../controller/communityController.js";

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Routes
router.get("/", getAllPosts);
router.post("/", upload.single("image"), createCommunityPost);
router.post("/:id/like", likePost);
router.post("/:id/comment", addComment);
router.post("/:id/repost", repostPost);

export default router;
