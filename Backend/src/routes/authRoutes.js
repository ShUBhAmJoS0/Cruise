
import express from "express"
import { registerUser,loginUser,googleSignup } from "../controller/authController.js";

const router = express.Router();

router.post("/signup",registerUser);
router.post("/login",loginUser);
router.post("/googleSignup",googleSignup);
export default router