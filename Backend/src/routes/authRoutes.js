
import express from "express"
import { registerUser,loginUser, getUser } from "../controller/authController.js";
import authToken from "../middleware/firebaseAuth.js";

const router = express.Router();

router.post("/signup",registerUser);
router.post("/login",loginUser);
router.get("/getuser",authToken,getUser)
export default router