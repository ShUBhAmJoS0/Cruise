


import { Link, useLocation } from "react-router-dom";

export function AttendeeNavBar({ logout, user, dbuser }) {
  const location = useLocation();
  const primaryColor = "#3593A6";


  const isActive = (path) => location.pathname === path;

  const navItems = [
    { name: "Home", path: "/landing" },
    { name: "ExploreEvents", path: "/events" },
    { name: "Shop", path: "/merchandise" },
    { name: "Community", path: "/community" },
    { name: "Find artists", path: "/searchartists" },
    { name: "About", path: "/about" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-1 bg-white shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 px-4 md:px-10 gap-4">

        <div className="flex  justify-center items-center gap-4 md:gap-70">
          <div className="font-bold text-3xl " style={{ color: primaryColor }}>
            Cruise
          </div>

          <div className="flex flex-wrap gap-4 md:gap-7 text-sm md:text-lg font-bold">
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
        </div>

        {/* Right: Search + Profile */}
        <div className="flex items-center gap-4 w-full md:w-auto">
    

          <div className="w-10 h-10 rounded-full flex mr-2 border-2 border-white shadow-md shrink-0 overflow-hidden">
            <img
              src={dbuser?.profileImage ? `http://localhost:5000/${dbuser.profileImage}` : "/images/defaultprofilepic.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-black w-[200px]">{dbuser?.name || user?.displayName}</h3>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}
