function ArtistDashboard(){
return(
        <div className="flex bg-[#F5F5F5] h-[100dvh] flex-col ml-[20%] w-[80%] p-10">
            <h1 className="text-2xl font-semibold">{`Welcome Back ${"sabrina"} `}</h1>
            <p className="text-gray-500 text-sm "> Here your overview for the month</p>
            <div className="grid grid-cols-2 gap-10 mt-10">
<div className="flex-1 h-45 bg-white shadow-lg rounded-2xl">
    <img></img>
</div>
<div className="flex-1 h-45 bg-white shadow-lg rounded-2xl"></div>
<div className="flex-1 h-45 bg-white shadow-lg rounded-2xl"></div>
<div className="flex-1 h-45 bg-white shadow-lg rounded-2xl"></div>
            </div>
        </div>
)
}
export {ArtistDashboard}