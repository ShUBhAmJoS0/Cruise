import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";

export function ArtistNavbar({  logout, dbuser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [expandedMenu, setExpandedMenu] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50 shadow-sm">
        <div className="flex items-center gap-3">
          <img
            src={getImageUrl(dbuser.profileImage)}
            className="w-10 h-10 rounded-full border-2 border-[#3593A6] object-cover"
            alt="Profile"
          />
          <div>
            <h4 className="font-semibold text-gray-900 text-sm">{dbuser.name}</h4>
            <p className="text-xs text-gray-500">{dbuser.email}</p>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          {isMobileMenuOpen ? (
            <X size={24} className="text-gray-700" />
          ) : (
            <Menu size={24} className="text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      <aside className={`
        h-screen w-80 fixed left-0 top-0 bg-white text-gray-800 flex flex-col shadow-xl z-40 border-r border-gray-200
        lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 ease-in-out
      `}>


        <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-[#3593A6]/5 to-[#93CAD5]/5">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={getImageUrl(dbuser.profileImage)}
              className="w-16 h-16 rounded-full border-4 border-[#3593A6] object-cover shadow-md"
              alt="Profile"
            />
            <div className="min-w-0">
              <h4 className="font-semibold text-lg truncate text-gray-900">{dbuser.name}</h4>
              <p className="text-sm text-gray-600 truncate">{dbuser.email}</p>
            </div>
          </div>

          <Link to="/artist/EditProfile" onClick={closeMobileMenu}>
            <button className="w-full bg-[#3593A6] text-white font-medium py-2.5 rounded-xl hover:bg-[#2d7a8a] transition-all shadow-sm">
              Edit Profile
            </button>
          </Link>
        </div>


        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">


          <Link to="/artist/Profile" onClick={closeMobileMenu}>
            <button
              onClick={() => {
                setSelected("Myprofile");
                setExpandedMenu("");
              }}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                selected === "Myprofile"
                  ? "bg-[#3593A6]/10 text-[#3593A6] shadow-sm border border-[#3593A6]/20"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <img src="/images/User.png" className="w-5 h-5" />
              <span className="font-medium">My Profile</span>
            </button>
          </Link>


          <div>
            <button
              onClick={() => {
                setSelected("ManageEvents")
                toggleMenu("ManageEvents")}}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                selected === "ManageEvents" || expandedMenu === "ManageEvents"
                  ? "bg-[#3593A6]/10 text-[#3593A6] shadow-sm border border-[#3593A6]/20"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <img src="/images/File text.png" className="w-5 h-5" />
              <span className="font-medium flex-1 text-left">Manage Events</span>
              <ChevronDown
                size={18}
                className={`transition-transform ${expandedMenu === "ManageEvents" ? "rotate-180" : ""}`}
              />
            </button>

            {expandedMenu === "ManageEvents" && (
              <div className="ml-6 mt-2 space-y-1 border-l-2 border-[#3593A6]/30 pl-4">
                <Link to="/artist/Request/" onClick={closeMobileMenu}>
                  <button className="submenu-btn">Add Events</button>
                </Link>
                <Link to="/artist/viewevent" onClick={closeMobileMenu}>
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
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${
                selected === "Merchandise" || expandedMenu === "Merchandise"
                  ? "bg-[#3593A6]/10 text-[#3593A6] shadow-sm border border-[#3593A6]/20"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              <img src="/images/Shopping bag.png" className="w-5 h-5" />
              <span className="font-medium flex-1 text-left">Merchandise</span>
              <ChevronDown
                size={18}
                className={`transition-transform ${expandedMenu === "Merchandise" ? "rotate-180" : ""}`}
              />
            </button>

            {expandedMenu === "Merchandise" && (
              <div className="ml-6 mt-2 space-y-1 border-l-2 border-[#3593A6]/30 pl-4">
                <Link to="/artist/Addmerch" onClick={closeMobileMenu}>
                  <button className="submenu-btn">Add Merchandise</button>
                </Link>
                <Link to="/artist/viewmerch" onClick={closeMobileMenu}>
                  <button className="submenu-btn">View Merchandise</button>
                </Link>
              </div>
            )}
          </div>
        </nav>


        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white transition-all py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm font-medium"
          >
            <span>Log Out</span>
          </button>
        </div>


        <style>{`
          .submenu-btn {
            width: 100%;
            text-align: left;
            padding: 0.5rem 1rem;
            font-size: 0.875rem;
            border-radius: 0.75rem;
            transition: all 0.2s;
            color: #4b5563;
          }
          .submenu-btn:hover {
            background: rgba(53, 147, 166, 0.1);
            color: #3593A6;
          }
        `}</style>
      </aside>
    </>
  );
}