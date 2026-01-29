
import { useState } from "react";
import { auth, isMockMode } from "../firebase.js";
import { sendPasswordResetEmail } from "firebase/auth";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const Resetbtn = async () => {

        if (!email) {
            toast.error("please enter your email");
            return
        }
        try {
            if (isMockMode) {
                console.log("Mock Password Reset for:", email);
                toast.success("Mock Mode: Password reset link (simulated) sent!");
            } else {
                await sendPasswordResetEmail(auth, email);
               toast.success("Password reset link sent!");
            }
        }
        catch (e) {
            console.log("error:", e)
        }
    }

    return (
        <div className="bg-[#C8C8C8] flex items-center justify-center min-h-[100dvh] w-full overflow-hidden px-2 sm:px-10">
            <div className="bg-white flex flex-col items-center justify-center p-15 w-full max-w-2xl shadow-[5px_5px_10px_grey] rounded-[11px]">
                <h1 className="text-2xl md:text-4xl font-semibold mt-7.5 mb-10 text-[#3593A6]"> Reset Password</h1>
                <div className="flex flex-col border-x-2 border-[#3593A6] px-6 w-85 sm:w-133">
                    <p className="mb-10 font-semibold w-60 sm:w-[900px]">Please enter the email address you want your reset link to be sent</p>


                    <label className="mb-5">Email address:</label>
                    <input type="email" className="w-[280px] h-[60px] sm:w-[480px] border border-black rounded-md p-10 "
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />

                    <button onClick={Resetbtn}
                        className="sm:w-[480px] sm:h-[60px] rounded-[10px] bg-[#3593A6] text-white mt-10 border-none flex items-center justify-center  w-[280px] h-[60px]"
                    >
                        Send Link
                    </button>
                    <Link to="/login" className="text-[#3593A6] font-semibold no-underline  mt-4 self-center">Back to Login</Link>
                </div>
            </div>
        </div>
    )
}