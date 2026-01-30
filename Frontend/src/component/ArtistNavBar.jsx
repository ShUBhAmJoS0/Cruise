import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, File, Menu, Shirt, User, Users, X } from "lucide-react";

export function ArtistNavbar({ logout, dbuser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");
  const [expandedMenu, setExpandedMenu] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!dbuser) {
    return null;
  }

  const getImageUrl = (pathOrBlob) => {
    if (!pathOrBlob) return "/images/defaultprofilepic.png";
    if (pathOrBlob.startsWith("http") || pathOrBlob.startsWith("blob:")) return pathOrBlob;
    return `http://localhost:5000/${pathOrBlob}`;
  };

  useEffect(() => {
    if (location.pathname.toLowerCase().includes("profile")) {
      setSelected("Myprofile");
    }
    if (location.pathname.toLowerCase().includes("reviews")) {
      setSelected("User reviews");
    }
    else if (location.pathname.toLowerCase().includes("request")) {
      setSelected("ManageEvents");
      setExpandedMenu("ManageEvents");
    } else if (location.pathname.toLowerCase().includes("merch")) {
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
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 z-50 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <img
            src={getImageUrl(dbuser.profileImage)}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#3593A6] object-cover flex-shrink-0"
            alt="Profile"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-gray-900 text-sm truncate">{dbuser.name}</h4>
            <p className="text-xs text-gray-500 truncate hidden sm:block">{dbuser.email}</p>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X size={20} className="text-gray-700 sm:w-6 sm:h-6" />
          ) : (
            <Menu size={20} className="text-gray-700 sm:w-6 sm:h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={closeMobileMenu}
          onTouchStart={closeMobileMenu}
        />
      )}

      <aside className={`
        h-screen fixed left-0 top-0 bg-white text-gray-800 flex flex-col shadow-xl border-r border-gray-200
        lg:translate-x-0 lg:w-80 lg:z-30
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 ease-in-out z-50
        w-72 sm:w-80
      `}>


        <div className="p-4 sm:p-6 border-b border-gray-100 bg-gradient-to-br from-[#3593A6]/5 to-[#93CAD5]/5">
          <div className="flex items-center gap-3 sm:gap-4 mb-4">
            <img
              src={getImageUrl(dbuser.profileImage)}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-3 sm:border-4 border-[#3593A6] object-cover shadow-md flex-shrink-0"
              alt="Profile"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-base sm:text-lg truncate text-gray-900">{dbuser.name}</h4>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{dbuser.email}</p>
            </div>
          </div>

          <Link to="/artist/editprofile" onClick={closeMobileMenu}>
            <button className="w-full bg-[#3593A6] text-white font-medium py-2.5 rounded-xl hover:bg-[#2d7a8a] transition-all shadow-sm text-sm sm:text-base">
              Edit Profile
            </button>
          </Link>
        </div>


        <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-2 overflow-y-auto">


          <Link to="/artist/profile" onClick={closeMobileMenu}>
            <button
              onClick={() => {
                setSelected("Myprofile");
                setExpandedMenu("");
              }}
              className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl flex items-center gap-3 transition-all touch-manipulation ${selected === "Myprofile"
                  ? "bg-[#3593A6]/10 text-[#3593A6] shadow-sm border border-[#3593A6]/20"
                  : "hover:bg-gray-100 text-gray-700 active:bg-gray-200"
                }`}
            >
              <User className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">My Profile</span>
            </button>
          </Link>


          <div>
            <button
              onClick={() => {
                setSelected("ManageEvents")
                toggleMenu("ManageEvents")
              }}
              className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl flex items-center gap-3 transition-all touch-manipulation ${selected === "ManageEvents" || expandedMenu === "ManageEvents"
                  ? "bg-[#3593A6]/10 text-[#3593A6] shadow-sm border border-[#3593A6]/20"
                  : "hover:bg-gray-100 text-gray-700 active:bg-gray-200"
                }`}
            >
              <File className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium flex-1 text-left text-sm sm:text-base">Manage Events</span>
              <ChevronDown
                size={16}
                className={`transition-transform flex-shrink-0 ${expandedMenu === "ManageEvents" ? "rotate-180" : ""}`}
              />
            </button>

            {expandedMenu === "ManageEvents" && (
              <div className="ml-4 sm:ml-6 mt-2 space-y-1 border-l-2 border-[#3593A6]/30 pl-3 sm:pl-4">
                <Link to="/artist/request" onClick={closeMobileMenu}>
                  <button className="submenu-btn w-full text-left">Add Events</button>
                </Link>
                <Link to="/artist/viewevent" onClick={closeMobileMenu}>
                  <button className="submenu-btn w-full text-left">View Event details</button>
                </Link>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => {
                toggleMenu("Merchandise")
                setSelected("Merchandise")
              }}
              className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl flex items-center gap-3 transition-all touch-manipulation ${selected === "Merchandise" || expandedMenu === "Merchandise"
                  ? "bg-[#3593A6]/10 text-[#3593A6] shadow-sm border border-[#3593A6]/20"
                  : "hover:bg-gray-100 text-gray-700 active:bg-gray-200"
                }`}
            >
              <Shirt className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium flex-1 text-left text-sm sm:text-base">Merchandise</span>
              <ChevronDown
                size={16}
                className={`transition-transform flex-shrink-0 ${expandedMenu === "Merchandise" ? "rotate-180" : ""}`}
              />
            </button>

            {expandedMenu === "Merchandise" && (
              <div className="ml-4 sm:ml-6 mt-2 space-y-1 border-l-2 border-[#3593A6]/30 pl-3 sm:pl-4">
                <Link to="/artist/addmerch" onClick={closeMobileMenu}>
                  <button className="submenu-btn w-full text-left">Add Merchandise</button>
                </Link>
                <Link to="/artist/viewmerch" onClick={closeMobileMenu}>
                  <button className="submenu-btn w-full text-left">View Merchandise</button>
                </Link>
              </div>
            )}
          </div>
          <Link to="/artist/fetchreviews" onClick={closeMobileMenu}>
            <button
              onClick={() => {
                setSelected("User reviews");
                setExpandedMenu("");
              }}
              className={`w-full px-3 sm:px-4 py-3 sm:py-3.5 rounded-xl flex items-center gap-3 transition-all touch-manipulation ${selected === "User reviews"
                  ? "bg-[#3593A6]/10 text-[#3593A6] shadow-sm border border-[#3593A6]/20"
                  : "hover:bg-gray-100 text-gray-700 active:bg-gray-200"
                }`}
            >
              <Users className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">User reviews</span>
            </button>
          </Link>
        </nav>



        <div className="p-3 sm:p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white transition-all py-3 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm font-medium text-sm sm:text-base touch-manipulation"
          >
            <span>Log Out</span>
          </button>
        </div>


        <style>{`
          .submenu-btn {
            width: 100%;
            text-align: left;
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            border-radius: 0.5rem;
            transition: all 0.2s;
            color: #4b5563;
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          .submenu-btn:hover {
            background: rgba(53, 147, 166, 0.1);
            color: #3593A6;
          }
          .submenu-btn:active {
            background: rgba(53, 147, 166, 0.15);
          }

          @media (max-width: 640px) {
            .submenu-btn {
              padding: 0.625rem 0.75rem;
              font-size: 0.8125rem;
              min-height: 44px;
            }
          }
        `}</style>
      </aside>
    </>
  );
}