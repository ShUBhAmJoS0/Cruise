import { useState, useContext } from "react";
import api from "../api/axios";
import InputField from "../components/InputComponent";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"
import "./Signup.css"
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
      const res = await api.post("/auth/signup", { name, email, password });

      saveToken(res.data.token);
      alert("Signup successful!");
      navigate("/login");
    } catch (error) {
        console.log(error)
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="background-main">
      <div className="Contentboard">
        <h1 className="TextStyle">
          Join the cruise Community
        </h1>
<div className="FieldContainer">
        <InputField label="Name" value={name} setValue={setName} />
        <InputField label="Email Address" value={email} setValue={setEmail} type="email" />
        <InputField label="Password" value={password} setValue={setPassword} type="password" />
      <InputField label="Confirm Password" value={retype} setValue={setRetype} type="password" />
      <div className="Signupcontainer">
      <label>Account Type</label> 
      <label><input type="radio" name="User" value="Attendee" checked={User==="Attendee"} onChange={(e)=>setUser(e.target.value)}/>Attendee</label>
      <label><input type="radio" name="User" value="Artist" checked={User==="Artist"} onChange={(e)=>setUser(e.target.value)}/>Artist</label>
      </div>
      </div>

        <button
          onClick={signupUser}
          className="ButtonClass"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?
          <Link className="text-blue-600 font-semibold ml-1" to="/login">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
