import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";


export function ArtistNavbar({user,logout,dbuser}){
  
  const location = useLocation();
  const navigate = useNavigate();
    const[selected,setSelected]=useState("");
const getImageUrl = (pathOrBlob) => {
  if (!pathOrBlob) return "/images/defaultprofilepic.png"; // fallback
  if (pathOrBlob.startsWith("http") || pathOrBlob.startsWith("blob:")) return pathOrBlob; // already full URL
  return `http://localhost:5000${pathOrBlob}`;
};
    useEffect(() => {
    if (location.pathname.includes("Profile")) setSelected("Myprofile");
    else if (location.pathname.includes("Request")) setSelected("ManageEvents");
    else if (location.pathname.includes("merch")) setSelected("Merchandise");
    else setSelected(""); 
  }, [location.pathname]);

    const handleLogout = async () => {
    await logout();
    navigate("/login"); 
  };
    return(
        

<div className="h-[100%] p-4 md:p-5 bg-[#3593A6] w-[20%] flex flex-col  fixed  ">
    <div className="flex  items-center gap-4 ">
<img src={getImageUrl(dbuser.profileImage)} className="md:w-[70px] md:h-[70px] w-[30px] h-[30px] border-white rounded-full"></img>
<div className="flex flex-col">
<h4 className="w-[110px] font-semibold text-white">{dbuser.name}</h4>
<span  className="w-[120px]  text-gray-200">{dbuser.email}</span>
</div>
</div>
<Link to="/artist/EditProfile"><button className = "md:h-[40px] h-[10px] w-full bg-[#D6EDF2] mt-4 mb-4 rounded-[10px] ">Edit Profile</button></Link>
<img src="/images/Line 8.png"></img>
<div className="flex md:mt-5 mt-2 flex-col">
<Link to="/artist/Profile"><button onClick={()=> setSelected("Myprofile")} className={`text-white text-left h-[50px] w-full flex items-center gap-3 mb-3 p-3 transition duration-200 ${
    selected === "Myprofile" ? "bg-white/20" : "bg-transparent hover:bg-white/20"
  }`}> <img src="/images/User.png" className="w-[25px] h-[25px]" ></img>My profile</button></Link>
<Link to="/artist/Request"><button onClick={()=> setSelected("ManageEvents")}className={`text-white text-left h-[50px] w-full flex items-center gap-3 mb-3 p-3 transition duration-200 ${
    selected === "ManageEvents"? "bg-white/20" : "bg-transparent hover:bg-white/20"
  }`}> <img src="/images/File text.png" className="w-[25px] h-[25px]" ></img>Manage Events</button></Link>
<Link to="/artist/Addmerch"><button onClick={()=> setSelected("Merchandise")} className={`text-white text-left h-[50px] w-full flex items-center gap-3 mb-3 p-3 transition duration-200 ${
    selected === "Merchandise" ? "bg-white/20" : "bg-transparent hover:bg-white/20"
  }`} > <img src="/images/Shopping bag.png" className="w-[25px] h-[25px]" ></img>Merchandise </button></Link>
<button onClick={handleLogout} className="text-white text-left h-[50px] flex items-center gap-3 mb-3 p-3 w-full transition duration-200 " > <img src="/images/Shopping bag.png" className="w-[25px] h-[25px]" ></img> Log out</button>
</div>
</div>
)
}