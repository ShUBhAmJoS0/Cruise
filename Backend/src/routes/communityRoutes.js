import express from "express";
import multer from "multer";
import {createCommunityPost, getAllPosts, updateCommunityPost, deleteCommunityPost, likePost, addComment, repostPost, getCurrentUser, } from "../controller/communityController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// User route
router.get("/auth/me", getCurrentUser);

// Community routes
router.get("/", getAllPosts);
router.post("/", upload.single("image"), createCommunityPost);
router.put("/:id", upload.single("image"), updateCommunityPost);
router.delete("/:id", deleteCommunityPost);

// Interaction routes
router.post("/:id/like", likePost);
router.post("/:id/comment", addComment);
router.post("/:id/repost", repostPost);

export default router;