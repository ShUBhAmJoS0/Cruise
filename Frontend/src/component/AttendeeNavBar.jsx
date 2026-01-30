import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export function AttendeeNavBar({ logout, user, dbuser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const desktopDropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target)) &&
        (!mobileDropdownRef.current || !mobileDropdownRef.current.contains(event.target))
      ) {
        setProfileDropdown(false);
      }
    };

    if (profileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdown]);

  const navItems = [
    { name: "ExploreEvents", path: "/events" },
    { name: "Shop", path: "/merchandise" },
    { name: "Community", path: "/community" },
    { name: "Find Artists", path: "/searchartists" },
    { name: "About", path: "/about" },
  ];

  const isExploreEvents = location.pathname === "/events";

  return (
    <nav className={`${isExploreEvents ? "fixed" : "sticky mb-6"} top-4 left-4 right-4 z-50 bg-white/70 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl h-16`}>
      <div className="flex items-center justify-between py-3 px-6 lg:px-10 h-full relative">
        {/* Mobile Menu Button - Left */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2 z-10"
        >
          <span className={`block w-6 h-0.5 bg-slate-700 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-slate-700 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-slate-700 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Logo - Left on desktop, centered on mobile */}
        <Link to="/events" className="flex items-center shrink-0 absolute left-1/2 -translate-x-1/2 lg:relative lg:left-auto lg:translate-x-0">
          <img src="/images/cruise logo.png" alt="Cruise Logo" className="h-7 lg:h-9 w-auto" />
        </Link>

        {/* Desktop Navigation - Centered */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-[15px] font-semibold">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative py-1 transition-all text-slate-500 hover:text-slate-800 ${isActive(item.path)
                ? "after:block after:absolute after:-bottom-1.5 after:left-0 after:w-full after:h-0.5 after:bg-[#3593A6] text-[#3593A6]"
                : ""
                }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Profile Section - Right */}
        <div className="hidden lg:flex items-center gap-3 relative ml-auto" ref={desktopDropdownRef}>
          {/* Vertical Divider */}
          <div className="h-6 w-px bg-slate-200 mr-2" />

          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setProfileDropdown(!profileDropdown)}
          >
            <div className="flex flex-col items-end">
              <h3 className="text-slate-800 font-bold text-[15px] leading-tight">{dbuser?.name || user?.displayName}</h3>
            </div>
            <div className="w-9 h-9 rounded-xl border-2 border-white shadow-sm overflow-hidden group-hover:border-[#3593A6] transition-all">
              <img
                src={dbuser?.profileImage ? `http://localhost:5000/${dbuser.profileImage}` : "/images/defaultprofilepic.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <span className={`material-symbols-outlined text-slate-400 transition-transform text-xl ${profileDropdown ? 'rotate-180' : ''}`}>expand_more</span>
          </div>

          {profileDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 animate-fadein overflow-hidden">
              <div className="p-2">
                <button
                  onClick={() => { setProfileDropdown(false); navigate("/usereditprofile"); }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-700 transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg">person</span>
                  Edit Profile
                </button>
                <button
                  onClick={() => { setProfileDropdown(false); navigate("/mybookings"); }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-700 transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg">confirmation_number</span>
                  My Bookings
                </button>
                <button
                  onClick={() => { setProfileDropdown(false); navigate("/orderhistory"); }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-700 transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg">history</span>
                  Order History
                </button>
                <button
                  onClick={() => { setProfileDropdown(false); navigate("/cart"); }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-700 transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg">shopping_cart</span>
                  My Cart
                </button>
                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                <button
                  onClick={() => { setProfileDropdown(false); logout(); }}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 rounded-xl text-sm font-semibold text-red-600 transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Profile Trigger */}
        <div className="lg:hidden z-10" ref={mobileDropdownRef}>
          <div
            className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden cursor-pointer"
            onClick={() => setProfileDropdown(!profileDropdown)}
          >
            <img
              src={dbuser?.profileImage ? `http://localhost:5000/${dbuser.profileImage}` : "/images/defaultprofilepic.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {profileDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-2xl z-[60] animate-fadein">
              <button
                className="w-full text-left px-4 py-2 hover:bg-slate-50 rounded-t-xl text-sm font-semibold text-slate-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdown(false);
                  navigate("/usereditprofile");
                }}
              >
                Edit Profile
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm font-semibold text-slate-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdown(false);
                  navigate("/mybookings");
                }}
              >
                My Bookings
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm font-semibold text-slate-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdown(false);
                  navigate("/orderhistory");
                }}
              >
                My Order History
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm font-semibold text-slate-700"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdown(false);
                  navigate("/cart");
                }}
              >
                My Cart
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-b-xl text-sm font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdown(false);
                  logout();
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-[72px] left-0 right-0 bg-white border border-slate-100 shadow-2xl rounded-2xl z-40 mx-4 animate-fadein">
          <div className="flex flex-col gap-1 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`py-3 px-4 text-sm font-semibold rounded-xl transition-all ${isActive(item.path)
                  ? "bg-[#3593A6]/10 text-[#3593A6] border-l-4 border-[#3593A6]"
                  : "text-slate-700 hover:bg-slate-50"
                  }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t border-slate-100 pt-3 mt-2 px-4">
              <h3 className="text-slate-800 text-sm font-bold">
                {dbuser?.name || user?.displayName}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes fadein {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadein { animation: fadein 0.2s ease-out forwards; }
      `}</style>
    </nav>
  );
}
