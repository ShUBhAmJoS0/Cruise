import { useState, useContext,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";
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
  className="flex items-center justify-center min-h-screen bg-center bg-no-repeat bg-cover px-4 sm:px-6"
  style={{ backgroundImage: "url('/images/Loginbackground.png')" }}
>
  <div className="relative bg-white overflow-hidden rounded-[10px] w-3/5 pl-15 flex-column">
    <div className="absolute top-0 right-0"><img className="w-[320px]" src="/images/BoardStyle3.png"></img></div>
        <div className="flex flex-col w-[57%]">
<h1 className="text-4xl font-semibold mt-7.5 mb-5 text-[#3593A6]">Welcome Back to cruise</h1>

     
      <div className="flex flex-col">
        
      <label className="text-black mt-5 mb-2.5">Email</label>
       <input 
        type="email"
        className="w-[480px] h-[60px] border border-black rounded-md p-4 "
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
              />
      </div>
<div className="flex flex-col">
        
      <label className="text-black mt-5 mb-2.5">Password</label>
       <input 
        type="password"
        className="w-[480px] h-[60px] border border-black rounded-md p-4 "
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
              />
      </div>

    
 <Link to="/forgotpassword" className="text-[#9C9090] font-semibold no-underline mt-2.5 self-end">Forgot Password?</Link>
    <button
      onClick={loginUser}
      className="w-[480px] h-[60px] rounded-[10px] bg-[#3593A6] text-white mt-5 border-none flex items-center justify-center"
    >
      Login
    </button>
 <button
      onClick={googleLogin}
      className="w-[480px] h-[60px] rounded-[10px] bg-[#3593A6] text-white mt-5 border-none flex items-center justify-center"
    >
   <img className=" w-[22px] h-[22px] mr-3" src="/images/google.png"></img>Continue with google
    </button>
    <div className="flex gap-2.5 my-5">
     <p>Dont have an account?</p>
      <Link to="/signup" className="text-[#3593A6] font-semibold no-underline">Sign Up</Link>
      </div>
    </div>
  </div>
</div>

  );
}
