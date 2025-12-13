
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import dotenv from "dotenv";
import admin from "firebase-admin";
import serviceAccount from "../../adminsdk.json" with { type: "json" }; 
dotenv.config();
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
//register User
const registerUser = async (req, res) => {
  try {
        const { id_token, email, name, userType } = req.body;

    // Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(id_token);
const firebase_uid = decodedToken.uid;
    // Check if user exists in Postgres
    let user = await User.findOne({ where: {firebase_uid} });
   
    
    //  If not, create user in Postgres
    if (!user) {
      user = await User.create({
        firebase_uid,
        email,
        name,
        userType,
      });
    }

 const token = jwt.sign({ firebase_uid }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Signup successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType,
      },
      token,
    });
  } catch (error) {
    console.log("firebaseSignup error:", error.message,error);
    res.status(500).json({ message: "Server error" });
  }
}
//login//
const loginUser = async (req, res) => {
try {
    const { id_token } = req.body;

    //  Verify Firebase ID Token
    const decodedToken = await admin.auth().verifyIdToken(id_token);
const firebase_uid = decodedToken.uid;
    // Look up the user in Postgres
    let user = await User.findOne({ where: { firebase_uid } });

    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    // Issue your backend JWT
    const token = jwt.sign({ firebase_uid }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        userType: user.userType,
      },
      token,
    });
  } catch (error) {
    console.log("firebaseLogin error:", error);
    res.status(401).json({ message: "Invalid Firebase token or login failed" });
  }
};

const googleSignup= async(req,res)=>{
  try{
     const{googleId,name,email}=req.body;
      let user = await User.findOne({ where: { google_id: googleId } });
      if(!user){
          let existingUser = await User.findOne({ where: { email } });

      if (existingUser) {
        // Link googleId to existing user
        existingUser.google_id = googleId;
        await existingUser.save();
        return res.status(200).json({ message: "Google account linked", user: existingUser });
      }
        user = await User.create({
          name,
          email,
          googleId:googleId,
          userType:"Attendee"
        });
        res.status(200).json({message:"Signup sucessfull",user})

      }

  }
  catch(error){
console.log(error)
res.status(500).json({message:"Server error"})
  }
}
export { loginUser, registerUser,googleSignup };
