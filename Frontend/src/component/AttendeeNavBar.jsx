import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export function AttendeeNavBar({ logout, user, dbuser }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const primaryColor = "#3593A6";

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: "ExploreEvents", path: "/events" },
    { name: "Shop", path: "/merchandise" },
    { name: "Community", path: "/community" },
    { name: "Find artists", path: "/searchartists" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-white shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 px-4 md:px-10 gap-4">

        <div className="flex justify-between items-center w-full md:w-auto md:gap-20 lg:gap-70">
          <div className="flex items-center shrink-0">
            <img src="/images/cruise logo.png" alt="Cruise Logo" className="h-8 md:h-10" />
          </div>

          {/* Hamburger Menu Icon */}
          <button
            className="md:hidden text-slate-800 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="material-symbols-outlined text-3xl">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

        {/* Navigation Items - Hidden on mobile unless menu is open */}
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-7 w-full md:w-auto text-sm md:text-lg font-bold pb-4 md:pb-0`}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              style={{ color: primaryColor }}
              className={`relative py-1 px-1 transition-all w-full md:w-auto ${isActive(item.path)
                ? "after:block after:absolute after:-bottom-2 after:left-0 after:w-full after:h-1 after:bg-[#3593A6]"
                : ""
                }`}
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile Profile/Logout - Only visible inside menu on small screens */}
          <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-slate-100 w-full md:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden">
                <img
                  src={dbuser?.profileImage ? `http://localhost:5000/${dbuser.profileImage}` : "/images/defaultprofilepic.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-black font-bold truncate">{dbuser?.name || user?.displayName}</h3>
            </div>
            <button
              onClick={() => { setIsMenuOpen(false); logout(); }}
              className="w-full py-3 bg-[#3593A6] text-white rounded-xl font-bold hover:bg-[#0a0f18] transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Desktop Profile/Logout - Hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          <div className="w-10 h-10 rounded-full flex border-2 border-white shadow-md shrink-0 overflow-hidden">
            <img
              src={dbuser?.profileImage ? `http://localhost:5000/${dbuser.profileImage}` : "/images/defaultprofilepic.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-black font-bold whitespace-nowrap min-w-[120px] max-w-[200px] truncate">{dbuser?.name || user?.displayName}</h3>
          <button
            onClick={logout}
            className="px-4 py-2 border-2 border-[#3593A6] text-[#3593A6] font-bold rounded-lg hover:bg-[#3593A6] hover:text-white transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
