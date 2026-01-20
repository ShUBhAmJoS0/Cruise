import express from "express";
import { updateUserProfile } from "../controller/userController.js";
import authToken from "../middleware/firebaseAuth.js";
import upload from "../Config/multer.js";

const router = express.Router();

router.put("/updateProfile", authToken, upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'coverPic', maxCount: 1 }
]), updateUserProfile);

export default router;
