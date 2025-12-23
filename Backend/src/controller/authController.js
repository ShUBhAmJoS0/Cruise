import User from "../model/User.js";
import dotenv from "dotenv";
import { admin } from "../Config/firebaseAdmin.js";
dotenv.config();

//register User
const registerUser = async (req, res) => {
  try {
        const { id_token, email, name, userType } = req.body;

    // Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(id_token);
const firebase_uid = decodedToken.uid;
    // Check if user exists in Postgres
    let user = await User.findOne({ where: {firebase_uid} });
   
    if(!user){
          let existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        // Link googleId to existing user
        existingUser.firebase_uid = firebase_uid;
        await existingUser.save();
        return res.status(200).json({ message: "Google account linked", user: existingUser });
      }
  
      user = await User.create({
        firebase_uid,
        email,
        name,
        userType,
      });
    res.status(200).json({
      message: "Signup successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType,
      },
    });
  }}
   catch (error) {
    console.log("firebaseSignup error:", error.message,error);
    res.status(500).json({ message: "Server error" });
  }
}
//login//
const loginUser = async (req, res) => {
try {
    const { id_token } = req.body;

    const decodedToken = await admin.auth().verifyIdToken(id_token);
const firebase_uid = decodedToken.uid;

    let user = await User.findOne({ where: { firebase_uid } });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }
    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType,
      },
    });
  } catch (error) {
    console.log("firebaseLogin error:", error);
    res.status(500).json({ message: "Invalid Firebase token or login failed" });
  }
};
export const getUser = async (req, res) => {
  try {
    const firebaseUid = req.user.firebase_uid; 
    
    const user = await User.findOne({
      where: { firebase_uid: firebaseUid },
      attributes: ["id", "name", "email", "userType"], 
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user); 
  } catch (error) {
    console.error("getUser error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export { loginUser, registerUser};
