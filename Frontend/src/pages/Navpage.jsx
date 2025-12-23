import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export function Navbar({children}){
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); 
    const[selected,setSelected]=useState("");

    useEffect(() => {
    if (location.pathname.includes("Myprofile")) setSelected("Myprofile");
    else if (location.pathname.includes("Request")) setSelected("ManageEvents");
    else if (location.pathname.includes("Merchandise")) setSelected("Merchandise");
    else setSelected(""); // default
  }, [location.pathname]);

    const handleLogout = async () => {
    await logout();
    navigate("/login"); // redirect to login after logout
  };
    return(
        
        <div className="h-[100dvh] flex ">
<div className="h-[100%] p-4 md:p-5 bg-[#3593A6] w-[20%] flex flex-col  fixed  ">
    <div className="flex  items-center gap-4 ">
<img src="/images/defaultprofilepic.png" className="md:w-[70px] md:h-[70px] w-[30px] h-[30px] border-white rounded-full"></img>
<h4 className="w-[110px] font-semibold text-white">Artist Name</h4>
</div>
<button className = "md:h-[40px] h-[10px] bg-[#D6EDF2] mt-4 mb-4 rounded-[10px] ">Edit Profile</button>
<img src="/images/Line 8.png" className=""></img>
<div className="flex md:mt-5 mt-2 flex-col">
<button onClick={()=> setSelected("Myprofile")} className={`text-white text-left h-[50px] flex items-center gap-3 mb-3 p-3 transition duration-200 ${
    selected === "Myprofile" ? "bg-white/20" : "bg-transparent hover:bg-white/20"
  }`}> <img src="/images/User.png" className="w-[25px] h-[25px]" ></img>My profile</button>
<button onClick={()=> setSelected("ManageEvents")}className={`text-white text-left h-[50px] flex items-center gap-3 mb-3 p-3 transition duration-200 ${
    selected === "ManageEvents"? "bg-white/20" : "bg-transparent hover:bg-white/20"
  }`}> <img src="/images/File text.png" className="w-[25px] h-[25px]" ></img>Manage Events</button>
<button onClick={()=> setSelected("Merchandise")} className={`text-white text-left h-[50px] flex items-center gap-3 mb-3 p-3 transition duration-200 ${
    selected === "Merchandise" ? "bg-white/20" : "bg-transparent hover:bg-white/20"
  }`} > <img src="/images/Shopping bag.png" className="w-[25px] h-[25px]" ></img>Merchandise </button>
  <button onClick={handleLogout} className="text-white text-left h-[50px] flex items-center gap-3 mb-3 p-3 transition duration-200" > <img src="/images/Shopping bag.png" className="w-[25px] h-[25px]" ></img> Log out</button>
</div>
</div>
{children}
</div>
)
}