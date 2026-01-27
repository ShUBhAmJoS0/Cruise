import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";

export function ArtistNavbar({  logout, dbuser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [expandedMenu, setExpandedMenu] = useState("");

  const getImageUrl = (pathOrBlob) => {
    if (!pathOrBlob) return "/images/defaultprofilepic.png";
    if (pathOrBlob.startsWith("http") || pathOrBlob.startsWith("blob:")) return pathOrBlob;
    return `http://localhost:5000/${pathOrBlob}`;
  };

  useEffect(() => {
    if (location.pathname.includes("Profile")){
       setSelected("Myprofile");
    }
    else if (location.pathname.includes("Request")) {
      setSelected("ManageEvents");
      setExpandedMenu("ManageEvents");
    } else if (location.pathname.includes("merch")) {
      setSelected("Merchandise");
      setExpandedMenu("Merchandise");
    } else setSelected("");
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const toggleMenu = (menuName) => {
    setExpandedMenu(expandedMenu === menuName ? "" : menuName);
  };

  return (
    <aside className="h-screen w-80 fixed left-0 top-0 bg-[#3593A6]  text-white flex flex-col shadow-2xl">

      {/* Profile Section */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center gap-4 mb-4">
          <img
            src={getImageUrl(dbuser.profileImage)}
            className="w-16 h-16 rounded-full border-4 border-white/40 object-cover shadow-lg"
            alt="Profile"
          />
          <div className="min-w-0">
            <h4 className="font-semibold text-lg truncate">{dbuser.name}</h4>
            <p className="text-sm text-white/80 truncate">{dbuser.email}</p>
          </div>
        </div>

        <Link to="/artist/EditProfile">
          <button className="w-full bg-white text-[#3593A6] font-semibold py-2.5 rounded-lg hover:bg-white/90 transition shadow">
            Edit Profile
          </button>
        </Link>
      </div>


      <nav className="flex-1 px-4 py-6 space-y-2">


        <Link to="/artist/Profile">
          <button
            onClick={() => {
              setSelected("Myprofile");
              setExpandedMenu("");
            }}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition ${
              selected === "Myprofile"
                ? "bg-white/25 shadow-md"
                : "hover:bg-white/10"
            }`}
          >
            <img src="/images/User.png" className="w-5 h-5" />
            <span className=" font-medium">My Profile</span>
          </button>
        </Link>


        <div>
          <button
            onClick={() => {
              setSelected("ManageEvents")
              toggleMenu("ManageEvents")}}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition ${
              selected === "ManageEvents" || expandedMenu === "ManageEvents"
                ? "bg-white/25 shadow-md"
                : "hover:bg-white/10"
            }`}
          >
            <img src="/images/File text.png" className="w-5 h-5" />
            <span className=" font-medium">Manage Events</span>
            <ChevronDown
              size={18}
              className={`transition-transform flex-1 ${expandedMenu === "ManageEvents" ? "rotate-180" : ""}`}
            />
          </button>

          {expandedMenu === "ManageEvents" && (
            <div className="ml-6 mt-2 space-y-1 border-l border-white/30 pl-4">
              <Link to="/artist/Request/">
                <button className="submenu-btn">Add Events</button>
              </Link>
              <Link to="/artist/viewevent">
                <button className="submenu-btn">View Event details</button>
              </Link>
            </div>
          )}
        </div>

        <div>
          <button
          
            onClick={() => {toggleMenu("Merchandise")
              setSelected("Merchandise")
            }}
            className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition ${
              selected === "Merchandise" || expandedMenu === "Merchandise"
                ? "bg-white/25 shadow-md"
                : "hover:bg-white/10"
            }`}
          >
            <img src="/images/Shopping bag.png" className="w-5 h-5" />
            <span className=" font-medium">Merchandise</span>
            <ChevronDown
              size={18}
              className={`transition-transform flex-1 ${expandedMenu === "Merchandise" ? "rotate-180" : ""}`}
            />
          </button>

          {expandedMenu === "Merchandise" && (
            <div className="ml-6 mt-2 space-y-1 border-l border-white/30 pl-4">
              <Link to="/artist/Addmerch">
                <button className="submenu-btn">Add Merchandise</button>
              </Link>
              <Link to="/artist/viewmerch">
                <button className="submenu-btn">View Merchandise</button>
              </Link>
            </div>
          )}
        </div>
      </nav>


      <div className="p-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="w-full bg-[#8bc7d3] hover:bg-red-400 hover:text-black transition py-2.5 rounded-lg flex items-center justify-center gap-2 transition shadow"
        >
          <span className="font-medium">Log Out</span>
        </button>
      </div>


      <style>{`
        .submenu-btn {
          width: 100%;
          text-align: left;
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          border-radius: 0.5rem;
          transition: 0.2s;
        }
        .submenu-btn:hover {
          background: rgba(255,255,255,0.15);
        }
      `}</style>
    </aside>
  );
}
