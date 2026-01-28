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
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target) &&
        mobileDropdownRef.current &&
        !mobileDropdownRef.current.contains(event.target)
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
          className="lg:hidden absolute left-4 flex flex-col gap-1"
        >
          <span className="block w-6 h-0.5 bg-gray-800"></span>
          <span className="block w-6 h-0.5 bg-gray-800"></span>
          <span className="block w-6 h-0.5 bg-gray-800"></span>
        </button>

        {/* Cruise Logo - Centered on mobile/tablet, left-aligned on desktop */}
        <Link
          to="/events"
          className="flex items-center justify-center lg:block"
        >
          <img
            src="/images/cruise logo.png"
            className="h-10 lg:h-12 w-auto"
            alt="Cruise Logo"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-nowrap gap-3 lg:gap-6 text-sm lg:text-lg font-bold absolute left-1/2 transform -translate-x-1/2 -ml-14">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              style={{ color: primaryColor }}
              className={`relative py-1 px-1 transition-all ${
                isActive(item.path)
                  ? "after:block after:absolute after:-bottom-2 after:left-0 after:w-full after:h-1 after:bg-[#3593A6]"
                  : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right: Search + Profile - Desktop */}
        <div
          className="hidden lg:flex items-center gap-2 lg:gap-4 lg:ml-auto relative"
          ref={desktopDropdownRef}
        >
          <div
            className="w-10 h-10 rounded-full flex mr-2 border-2 border-white shadow-md shrink-0 overflow-hidden cursor-pointer relative"
            onClick={() => setProfileDropdown((v) => !v)}
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
          <h3
            className="text-black hidden lg:block w-[200px] cursor-pointer"
            onClick={() => setProfileDropdown((v) => !v)}
          >
            {dbuser?.name || user?.displayName}
          </h3>
          {profileDropdown && (
            <div className="absolute right-0 top-full mt-2 w-48 sm:w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-fadein">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded-t-xl"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdown(false);
                  navigate("/userEditProfile");
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

        {/* Mobile Profile - Fixed positioning */}
        <div
          className="lg:hidden absolute right-4 z-50"
          ref={mobileDropdownRef}
        >
          <div
            className="w-8 h-8 rounded-full flex border-2 border-white shadow-md shrink-0 overflow-hidden cursor-pointer"
            onClick={() => setProfileDropdown((v) => !v)}
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
        .animate-fadein { animation: fadein 0.18s ease; }
      `}</style>
    </nav>
  );
}
