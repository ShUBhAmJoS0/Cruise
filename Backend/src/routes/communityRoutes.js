import express from "express";
import multer from "multer";
import { createCommunityPost, getAllPosts, likePost, addComment, repostPost, } from "../controller/communityController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.get("/", getAllPosts);
router.post("/", upload.single("image"), createCommunityPost);
router.post("/:id/like", likePost);
router.post("/:id/comment", addComment);
router.post("/:id/repost", repostPost);

export default router;
