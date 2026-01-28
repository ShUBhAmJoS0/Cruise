import { useState, } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { auth, isMockMode, mockCreateUserWithEmailAndPassword, mockUpdateProfile } from "../firebase.js";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuth } from "../context/AuthContext.jsx";


export default function Signup() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retype, setRetype] = useState("");
  const [User, setUserr] = useState("");
  const [showpassword, setShowpassword] = useState(false);
  const { setRole, setUser, setDbuser } = useAuth();
  const signupUser = async () => {
    if (!name || !email || !password || !retype) {
      alert("All fields are required");
      return;
    }
    if (!User) {
      alert("Usertype must be selected");
      return;
    }
    try {
      let firebaseUser;
      if (isMockMode) {
        const userCredential = await mockCreateUserWithEmailAndPassword(auth, email, password);
        firebaseUser = userCredential.user;
        await mockUpdateProfile(firebaseUser, { displayName: name });
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        firebaseUser = userCredential.user;
        await updateProfile(firebaseUser, { displayName: name });
      }

      const idToken = await firebaseUser.getIdToken();

      const res = await api.post("/auth/signup", {
        email: firebaseUser.email,
        name: name,
        userType: User,
        id_token: idToken,
      });


      if (!res.data?.user) {
        alert("Something went wrong. Try again.");
        return;
      }
      setUser(firebaseUser)
      console.log(res.data.user.userType)
      setRole(res.data.user.userType);
      setDbuser(res.data.user)

      alert("Signup successful!");
      const role = res.data.user.userType
      console.log(role)
      if (role === "Admin") navigate("/admin");
      else if (role === "Artist") navigate("/artist/Request");
      else navigate("/events");
    } catch (error) {
      console.error("Signup error:", error);

      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.response && error.response.data && error.response.data.message) {
        // Backend/Axios error
        errorMessage = error.response.data.message;
      } else if (error.message) {
        // Firebase or Generic error
        errorMessage = error.message;
      }

      alert(errorMessage);
    }

  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-center bg-no-repeat bg-cover px-4 sm:px-6"
      style={{ backgroundImage: "url('/images/Loginbackground.png')" }}
    >
      <div className="relative bg-white overflow-hidden rounded-[10px] w-full max-w-4xl px-8 py-4 md:py-2 md:px-3  flex flex-col md:flex-row ">
        <img
          className="absolute top-0 left-0 w-32 sm:w-52 md:w-72 pointer-events-none"
          src="/images/Invertedboard.png"
          alt="Decor"
        />

        <div className="flex flex-col w-full md:w-1/2 ml-auto relative mr-8">

          <h1 className="text-3xl sm:text-4xl font-semibold mt-4 mb-5 text-[#3593A6]">
            Join the cruise Community
          </h1>

          <div className="flex flex-col">
            <label className="text-black mt-2 mb-2">Username</label>
            <input
              type="text"
              className="w-full max-w-lg h-[55px] border border-black rounded-md p-4"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your Username"
            />
          </div>


          <div className="flex flex-col mt-3">
            <label className="text-black mb-2">Email Address</label>
            <input
              type="email"
              className="w-full max-w-lg h-[55px] border border-black rounded-md p-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>


          <div className="flex flex-col mt-3 relative ">
            <label className="text-black mb-2">Password</label>
            <input
              type={showpassword ? "text" : "password"}
              className="w-full max-w-lg h-[55px] border border-black rounded-md p-4 "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"

            />
            <button type="button" className="absolute right-2 bottom-3" onClick={() => setShowpassword(!showpassword)}>
              {!showpassword ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="grey" class="size-6">
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd" />
              </svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="grey" class="size-6">
                <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
              </svg>

              }

            </button>
          </div>

          <div className="flex flex-col mt-3 relative">
            <label className="text-black mb-2">Confirm password</label>
            <input
              type={showpassword ? "text" : "password"}
              className="w-full max-w-lg h-[55px] border border-black rounded-md p-4"
              value={retype}
              onChange={(e) => setRetype(e.target.value)}
              placeholder="Re-enter your password"
            />
            <button type="button" className="absolute right-2 bottom-3" onClick={() => setShowpassword(!showpassword)}>
              {!showpassword ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="grey" class="size-6">
                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                <path fill-rule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clip-rule="evenodd" />
              </svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="grey" class="size-6">
                <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
                <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
                <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
              </svg>

              }

            </button>
          </div>

          {password && retype && password !== retype && (
            <p className="text-red-500 mt-1">Passwords do not match!</p>
          )}


          <div className="flex items-center gap-4 mt-4">
            <label className="font-bold text-[#3593A6]">Account Type:</label>

            <label>
              <input
                className="mr-2"
                type="radio"
                name="User"
                value="Attendee"
                checked={User === "Attendee"}
                onChange={(e) => setUserr(e.target.value)}
              />
              Attendee
            </label>

            <label>
              <input
                className="mr-2"
                type="radio"
                name="User"
                value="Artist"
                checked={User === "Artist"}
                onChange={(e) => setUserr(e.target.value)}
              />
              Artist
            </label>
          </div>


          <button
            onClick={signupUser}
            className="w-full max-w-lg h-[55px] rounded-[10px] bg-[#3593A6] text-white mt-4 flex items-center justify-center"
          >
            Sign Up
          </button>


          <p className="flex gap-2 my-4">
            Already have an account?
            <Link to="/login" className="text-[#3593A6] font-semibold no-underline">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}