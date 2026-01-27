


import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export function AttendeeNavBar({ logout, user, dbuser }) {
  const location = useLocation();
  const primaryColor = "#3593A6";
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const isActive = (path) => location.pathname === path;

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
        <div className="font-bold text-2xl lg:text-3xl whitespace-nowrap lg:block" style={{ color: primaryColor }}>
          Cruise
        </div>

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

        {/* Right: Search + Profile */}
        <div className="hidden lg:flex items-center gap-2 lg:gap-4 lg:ml-auto">
    

          <div className="w-10 h-10 rounded-full flex mr-2 border-2 border-white shadow-md shrink-0 overflow-hidden">
            <img
              src={dbuser?.profileImage ? `http://localhost:5000/${dbuser.profileImage}` : "/images/defaultprofilepic.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-black hidden lg:block w-[200px]">{dbuser?.name || user?.displayName}</h3>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-[#3593A6] text-white font-semibold rounded-lg hover:bg-[#2a7a8f] transition-colors duration-200 cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Mobile Profile */}
        <div className="lg:hidden absolute right-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex border-2 border-white shadow-md shrink-0 overflow-hidden">
            <img
              src={dbuser?.profileImage ? `http://localhost:5000/${dbuser.profileImage}` : "/images/defaultprofilepic.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 bg-white shadow-lg">
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
              <h3 className="text-black text-sm font-semibold mb-3">{dbuser?.name || user?.displayName}</h3>
              <button 
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-2 bg-[#3593A6] text-white font-semibold rounded-lg hover:bg-[#2a7a8f] transition-colors duration-200 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
