import { useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const { saveToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retype,setRetype] = useState("");
  const[User,setUser] = useState("");
  const signupUser = async () => {
    try {
      const res = await api.post("/auth/signup", { name, email, password, userType:User});

      saveToken(res.data.token);
      alert("Signup successful!");
      navigate("/login");
    } catch (error) {
        console.log(error)
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div   className="flex items-center justify-center min-h-screen bg-center bg-no-repeat bg-cover px-4 sm:px-6"
  style={{ backgroundImage: "url('/images/Loginbackground.png')" }}>
      <div className="relative bg-white overflow-hidden rounded-[10px] w-3/5 pr-15 flex-column">
      <div className="absolute top-0 left-0"><img className="w-[320px]" src="/images/Invertedboard.png"></img></div>
      <div className="flex flex-col w-[57%] ml-auto ">
        <h1 className="text-4xl font-semibold mt-4 mb-5 text-[#3593A6]">
          Join the cruise Community
        </h1>

   <div className="flex flex-col">
        
      <label className="text-black mt-2 mb-2">Username</label>
       <input 
        type="Text"
        className="w-[480px] h-[60px] border border-black rounded-md p-4 "
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your Username"
              />
      </div>
       <div className="flex flex-col">
        
      <label className="text-black mt-2 mb-2">Email Address</label>
       <input 
        type="email"
        className="w-[480px] h-[60px] border border-black rounded-md p-4 "
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
              />
      </div>
 <div className="flex flex-col">
        
      <label className="text-black mt-2 mb-2">Password</label>
       <input 
        type="password"
        className="w-[480px] h-[60px] border border-black rounded-md p-4 "
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
              />
      </div>
       <div className="flex flex-col">
        
      <label className="text-black mt-2 mb-2">Confirm password</label>
       <input 
        type="password"
        className="w-[480px] h-[60px] border border-black rounded-md p-4 "
        value={retype}
        onChange={(e) => setRetype(e.target.value)}
        placeholder="Re-enter your password"
              />
      </div>
      {password && retype && password !== retype && (
          <p style={{ color: "red"}}>
            Passwords do not match!
          </p>
        )}
      <div className="flex items-center gap-4 mt-3">
      <label className="font-bold text-[#3593A6]">Account Type: </label> 
      <label><input className="mr-2" type="radio" name="User" value="Attendee" checked={User==="Attendee"} onChange={(e)=>setUser(e.target.value)}/>Attendee</label>
      <label><input className="mr-2" type="radio" name="User" value="Artist" checked={User==="Artist"} onChange={(e)=>setUser(e.target.value)}/>Artist</label>
      </div>
 

        <button
          onClick={signupUser}
          className="w-[480px] h-[60px] rounded-[10px] bg-[#3593A6] text-white mt-3 border-none flex items-center justify-center"
        >
          Sign Up
        </button>

        <p className="flex gap-2.5 my-4">
          Already have an account?
          <Link className="text-[#3593A6] font-semibold no-underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
         </div>
  );
}
