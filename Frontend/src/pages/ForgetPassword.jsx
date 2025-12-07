
import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Link} from "react-router-dom";
export default function ForgetPassword(){
    const auth=getAuth();
    const[email, setEmail] = useState("");
    const Resetbtn=async()=>{

if(!email){
    alert("please enter your email");
    return
}
    try{
        await sendPasswordResetEmail(auth, email);
      alert("Password reset link sent!");
    }
    catch(e){
console.log("error:",e)
    }
}

return(
<div className="bg-[#C8C8C8] flex items-center justify-center min-h-screen  px-4 sm:px-6 ">
<div className="bg-white flex-column items-center justify-center p-10 shadow-[5px_5px_10px_grey] rounded-[11px]">
    <h1 className="text-4xl font-semibold mt-7.5 mb-10 text-[#3593A6]"> Reset Password</h1>
<p className="mb-10 font-semibold">Please enter the email address you want your reset link to be sent</p>

<div className="flex flex-col border-x-2 border-[#3593A6] px-6">
    <label className="mb-5">Email address:</label>
    <input type="email" className="w-[480px] h-[60px] border border-black rounded-md p-4 "
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
              />
             
              <button onClick={Resetbtn}
      className="w-[480px] h-[60px] rounded-[10px] bg-[#3593A6] text-white mt-10 border-none flex items-center justify-center"
    >
        Send Link
      </button>
        <Link to="/login" className="text-[#3593A6] font-semibold no-underline  mt-4 self-center">Back to Login</Link>
         </div>
</div>
</div>
)
}