import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

import { AuthContext } from "../context/AuthContext";
import { auth, provider } from "../firbase.js";
import { signInWithPopup } from "firebase/auth";
import {signInWithEmailAndPassword } from "firebase/auth";
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[showpassword,setShowpassword]=useState(false)

//   useEffect(() => {
//     if (saveToken) navigate("/dashboard");
//   }, [saveToken, navigate]);


  const loginUser = async () => {
    try{
      if(!email || !password){
        alert("Cannot leave any fields empty !")
        return ;
      }
 const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    const idToken = await firebaseUser.getIdToken();

    //  Send the ID Token to your backend
    const res = await api.post("/auth/login", {
      email: firebaseUser.email,
      id_token: idToken,
    });
    alert("Login successful!");
    navigate("/dashboard");
  }
catch (error) {
      alert(error.response?.data?.message || "Invalid credentials");
    }
  };


const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      
      console.log("User Info:", result.user);
      console.log("userId" , result.user.uid)
      alert("Logged in as " + result.user.displayName);
      const res = await api.post("/auth/googleSignup",{googleId:result.user.uid,name:result.user.displayName,email:result.user.email})
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
<div className="relative bg-white overflow-hidden rounded-[10px] w-full max-w-4xl p-6  md:p-14 flex flex-col md:flex-row gap-6">
<img
className="absolute top-0 right-0 w-40 md:w-100"
src="/images/BoardStyle3.png"
alt="Decoration"
/>


<div className="flex flex-col w-full md:w-1/2 z-10">
<h1 className="text-3xl sm:text-4xl font-semibold mt-6 mb-4 text-[#3593A6]">
Welcome Back to cruise
</h1>


<div className="flex flex-col">
<label className="text-black mt-4 mb-2">Email</label>
<input
type="email"
className="w-full h-[55px] border border-black rounded-md p-4"
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder="Enter your email"
/>
</div>


<div className="flex flex-col mt-4 relative">
<label className="text-black mb-2">Password</label>
<input
type={showpassword?"text":"password"}
className="w-full h-[55px] border border-black rounded-md p-4"
value={password}
onChange={(e) => setPassword(e.target.value)}
placeholder="Enter your password"
/>
<button type="button" className="absolute right-2 bottom-3" onClick={()=>setShowpassword(!showpassword)}>
        {!showpassword?<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="grey" class="size-6">
  <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
  <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd" />
</svg>:<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="grey" class="size-6">
  <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
  <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
  <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
</svg>

}

            </button>
</div>


<Link
to="/forgotpassword"
className="text-[#9C9090] font-semibold no-underline mt-2 self-end"
>
Forgot Password?
</Link>


<button
onClick={loginUser}
className="w-full h-[55px] rounded-[10px] bg-[#3593A6] text-white mt-5 flex items-center justify-center"
>
Login
</button>


<button
onClick={googleLogin}
className="w-full h-[55px] rounded-[10px] bg-[#3593A6] text-white mt-4 flex items-center justify-center"
>
<img
className="w-[22px] h-[22px] mr-3"
src="/images/google.png"
alt="Google"
/>
Continue with Google
</button>


<div className="flex gap-2 mt-5">
<p>Don't have an account?</p>
<Link to="/signup" className="text-[#3593A6] font-semibold no-underline">
Sign Up
</Link>
</div>
</div>
</div>
</div>
);
}
