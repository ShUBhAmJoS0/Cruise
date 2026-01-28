    export default function Usernavbar({children}){

    return(
        <>
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 px-4 md:px-10 gap-4">
          <div className="flex flex-wrap items-center gap-4 md:gap-20">
            <img src="/images/cruise logo.png" className="h-10 w-auto" alt="Cruise Logo" />
            <div className="flex flex-wrap gap-4 md:gap-6 text-sm md:text-lg font-bold text-[#95c9d3]">
              <a href="#" className="hover:underline">Home</a>
              <a href="#" className="hover:underline">ExploreEvents</a>
              <a href="#" className="border-b-2 border-[#95c9d3] pb-1">Shop</a>
              <a href="#" className="hover:underline">Community</a>
              <a href="#" className="hover:underline">About</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200" />
            <span className="text-base font-medium">User</span>
          </div>
        </div>
      </nav>
      {children}
      </>
      
    )
}