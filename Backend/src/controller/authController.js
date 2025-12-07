import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import dotenv from "dotenv";
dotenv.config();
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};
//register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, userType} = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password required" });

    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if(!userType){
       alert("Please choose an option!");
      return res.status(400).json({message:"empty usertype"})
    }
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    // password hashing
    const hashed = await bcrypt.hash(password, 10);
    // Insert new user
    const user = await User.create({
      name: name || null,
      email: email,
      password: hashed,
      userType:userType
    });
    const token = generateToken(user.id);

    res.status(201).json({
      message: "User registered sucessfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        userType:userType
      },
      token,
    });
  } catch (error) {
    console.log("RegusterUser error", error);
    res.status(500).json({ message: "Server error" });
  }
};

//login//
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "email and password required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });
    const token = generateToken(user.id);

    res.json({
      message: "Login sucessful",
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.log("loginUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
const googleSignup= async(req,res)=>{
  try{
     const{googleId,name,email}=req.body;
      let user = await User.findOne({ where: { google_id: googleId } });
      if(!user){
        user = await User.create({
          name,
          email,
          googleId:googleId,
          userType:"Attendee"
        });
        res.status(200).json({message:"Signup sucessfull",user})

      }
      else{
          return res.status(200).json({ message: "User already exists", user });
      }

  }
  catch(error){
console.log(error)
res.status(500).json({message:"Server error"})
  }
}
export { loginUser, registerUser,googleSignup };
