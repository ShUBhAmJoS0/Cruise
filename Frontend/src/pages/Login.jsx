import { useState, useContext,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import InputField from "../components/InputComponent";
import { AuthContext } from "../context/AuthContext";
import "./Login.css"
import { auth, provider } from "../firbase.js";
import { signInWithPopup } from "firebase/auth";

import { signOut } from "firebase/auth";

export default function Login() {
  const navigate = useNavigate();
  const { saveToken } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


//   useEffect(() => {
//     if (saveToken) navigate("/dashboard");
//   }, [saveToken, navigate]);


  const loginUser = async () => {
    try {
      const res = await api.post("/auth/login", { email, password });

      saveToken(res.data.token);
      alert("Login successful!");
      navigate("/dashboard");
      
    } catch (error) {
      alert(error.response?.data?.message || "Invalid credentials");
    }
  };


const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      
      console.log("User Info:", result.user);
      console.log("userId" , result.user.uid)
      alert("Logged in as " + result.user.displayName);
      const res= await api.post("/auth/googleSignup",{googleId:result.user.uid,name:result.user.displayName,email:result.user.email})
      navigate("/dashboard");
       
      // You can redirect or store user info here
    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  };

  
  return (
   <div 
  className="background-main"
>
  <div className="Contentboard">
    <div className="img-align"><img src="/images/BoardStyle3.png"></img></div>
    <div className="TextStyle"><h1>Welcome Back to cruise</h1></div>
    <div className="FieldContainer">
    <InputField label="Email Address" value={email} setValue={setEmail} type="email" placeholder="Enter your email"/>
    <InputField label="Password" value={password} setValue={setPassword} type="password" placeholder="Enter your password"/>
 <Link to="/forgot-password" className="ForgotPassword">Forgot Password?</Link>
    <button
      onClick={loginUser}
      className="ButtonClass"
    >
      Login
    </button>
 <button
      onClick={googleLogin}
      className="ButtonClass"
    >
   <img src="/images/google.png"></img>Continue with google
    </button>
    <div className="Signupcontainer">
     <p>Dont have an account?</p>
      <Link to="/signup" className="SignupText">Sign Up</Link>
      </div>
    </div>
  </div>
</div>

  );
}
