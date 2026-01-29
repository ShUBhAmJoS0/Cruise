
import express from "express"
import { registerUser, loginUser, getUser } from "../controller/authController.js";
import authToken from "../middleware/firebaseAuth.js";
import upload from "../Config/multer.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.get("/getuser", authToken, upload.fields([
  { name: 'image', maxCount: 1 }]), getUser)
export default router