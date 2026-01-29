import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export function AttendeeNavBar({ logout, user, dbuser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const primaryColor = "#3593A6";
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
    { name: "Find artists", path: "/searchartists" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg h-20">
      <div className="flex items-center justify-center lg:justify-between py-4 px-4 lg:px-10 h-full relative">
        {/* Mobile Menu Button - Absolute left position on mobile/tablet */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden flex flex-col gap-1.5 p-2"
        >
          <span className={`block w-6 h-0.5 bg-slate-800 transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-slate-800 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-slate-800 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Logo */}
        <Link to="/events" className="flex items-center shrink-0">
          <img src="/images/cruise logo.png" alt="Cruise Logo" className="h-10 lg:h-12 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 text-lg font-bold">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              style={{ color: primaryColor }}
              className={`relative py-1 transition-all ${isActive(item.path)
                ? "after:block after:absolute after:-bottom-2 after:left-0 after:w-full after:h-1 after:bg-[#3593A6]"
                : "hover:opacity-70"
                }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Desktop Profile / Right Side */}
        <div className="hidden lg:flex items-center gap-4 relative" ref={desktopDropdownRef}>
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setProfileDropdown(!profileDropdown)}
          >
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden group-hover:border-[#3593A6] transition-all">
              <img
                src={dbuser?.profileImage ? `http://localhost:5000/${dbuser.profileImage}` : "/images/defaultprofilepic.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-black font-bold max-w-[150px] truncate">{dbuser?.name || user?.displayName}</h3>
            <span className={`material-symbols-outlined transition-transform ${profileDropdown ? 'rotate-180' : ''}`}>expand_more</span>
          </div>

          {profileDropdown && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 animate-fadein overflow-hidden">
              <div className="p-2">
                <button
                  onClick={() => { setProfileDropdown(false); navigate("/userEditProfile"); }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg">person</span>
                  Edit Profile
                </button>
                <button
                  onClick={() => { setProfileDropdown(false); navigate("/mybookings"); }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg">confirmation_number</span>
                  My Bookings
                </button>
                <button
                  onClick={() => { setProfileDropdown(false); navigate("/orderhistory"); }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg">history</span>
                  Order History
                </button>
                <button
                  onClick={() => { setProfileDropdown(false); navigate("/cart"); }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg">shopping_cart</span>
                  My Cart
                </button>
                <div className="h-px bg-slate-100 my-1 mx-2"></div>
                <button
                  onClick={() => { setProfileDropdown(false); logout(); }}
                  className="w-full text-left px-4 py-3 hover:bg-red-50 rounded-xl text-sm font-bold text-red-600 transition-colors flex items-center gap-3"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Profile Trigger (Always visible on right) */}
        <div className="lg:hidden" ref={mobileDropdownRef}>
          <div
            className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden cursor-pointer"
            onClick={() => setProfileDropdown(!profileDropdown)}
          >
            <img
              src={
                dbuser?.profileImage
                  ? `http://localhost:5000/${dbuser.profileImage}`
                  : "/images/defaultprofilepic.png"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          {profileDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-[60] animate-fadein">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdown(false);
                  navigate("/attendee/EditProfile");
                }}
              >
                Edit Profile
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdown(false);
                  navigate("/mybookings");
                }}
              >
                My Bookings
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdown(false);
                  navigate("/orderhistory");
                }}
              >
                My Order History
              </button>
                       <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdown(false);
                  navigate("/cart");
                }}
              >
                My Cart
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 rounded-b-xl"
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
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-white shadow-lg z-40">
          <div className="flex flex-col gap-3 px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                style={{ color: primaryColor }}
                className={`py-2 px-2 text-sm font-bold transition-all ${
                  isActive(item.path)
                    ? "bg-blue-50 border-l-4 border-[#3593A6] pl-4"
                    : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="border-t pt-3 mt-3">
              <h3 className="text-black text-sm font-semibold mb-3">
                {dbuser?.name || user?.displayName}
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Floating dropdown animation */}
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
