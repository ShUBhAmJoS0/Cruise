
import { Link } from "react-router-dom"



export function AttendeeNavBar({logout,user}){
 

    const primaryColor="#3593A6"
    return(
<nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-300">
  <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 px-4 md:px-10 gap-4">

    <div className="flex flex-wrap items-center gap-4 md:gap-20">
      <div className="font-bold text-3xl" style={{ color: primaryColor }}>
        Cruise
      </div>

      <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-lg font-bold">
         <Link to="/landing" style={{ color: primaryColor }}>Home</Link>
        <Link to="/events"style={{ color: primaryColor }}>ExploreEvents</Link>
        <Link to="/merchandise"style={{ color: primaryColor }}>Shop</Link>
        <Link to="/community"style={{ color: primaryColor }}>Community</Link>
        <Link to="/Search artists"style={{ color: primaryColor }}>Find artists</Link>
        <Link to="/About Page"style={{ color: primaryColor }}>About</Link>
      </div>
    </div>

    {/* Right: Search + Profile */}
    <div className="flex items-center gap-4 w-full md:w-auto">
      
      {/* Search (hidden on very small screens) */}
      <div className="flex-1 md:flex-none  mr-6 md:w-72 hidden sm:block">
        <input
          type="text"
          placeholder="Search Events"
          className="w-full py-2.5 px-5 border border-gray-300 rounded-full text-sm md:text-base focus:outline-none"
        />
      </div>

      {/* Profile */}
      <div className=" h-10 rounded-full flex mr-2  border-2 border-white shadow-md shrink-0">
        <img
          src="/images/defaultprofilepic.png"
          alt="Profile"
          className="w-full h-full object-cover"
        />
       
      </div>
       <h3 className='text-black w-[200px]'>{user?.name || 'Loading...'}</h3>
      <button onClick={logout}>logout</button>
    </div>
  </div>
</nav>
    )
}
