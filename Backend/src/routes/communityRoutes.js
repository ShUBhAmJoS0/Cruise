import express from "express";
import {createCommunityPost, getCommunityPosts, likeCommunityPost, reshareCommunityPost, } from "../controller/communityController.js";
import authToken from "../middleware/firebaseAuth.js";

const router = express.Router();

router.get("/", getCommunityPosts);
router.post("/", authToken, createCommunityPost);
router.post("/:id/like", authToken, likeCommunityPost);
router.post("/:id/reshare", authToken, reshareCommunityPost);

export default router;
