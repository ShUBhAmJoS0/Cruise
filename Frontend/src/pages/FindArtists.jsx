import React, { useEffect, useState } from "react";
import api from "../api/axios"; // adjust your API path
import { useNavigate } from "react-router-dom";

function FindArtists() {
  const [artists, setArtists] = useState([]);
const navigate = useNavigate();


  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await api.get("/artist/all");
        console.log(res.data)

        setArtists(res.data.data)
      } catch (err) {
        console.error(err);
      }
    };
    fetchArtists();
  }, []);

  const handleFollow = (artistId) => {

    console.log("Follow clicked for artist:", artistId);
  };
if(!artists){
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-500">loading all artist profiles</div>
  )
}
  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Discover Artists
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="relative">
              <img
                src={artist.coverImage ? `http://localhost:5000/${artist.coverImage}` : "/images/defaultcover.png"}
                alt="Cover"
                className="w-full h-36 object-cover"
              />
              <img
                src={artist.profileImage ? `http://localhost:5000/${artist.profileImage}` : "/images/defaultprofilepic.png"}
                alt={artist.name}
                className="w-20 h-20 rounded-full border-4 border-white absolute -bottom-10 left-1/2 transform -translate-x-1/2 object-cover shadow-md"
              />
            </div>
            <div className="pt-12 pb-6 px-4 flex flex-col items-center text-center">
              <h2 className="text-xl font-semibold text-gray-800">{artist.name}</h2>
              <p className="text-gray-500 text-sm mt-1">{artist.bio || "No bio available"}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => handleFollow(artist.id)}
                  className="px-4 py-2 bg-[#93CAD5] text-white font-semibold rounded-lg hover:bg-[#82b8c7] transition"
                >
                  Follow
                </button>
                <button 
                onClick={()=>navigate(`/artist/profile/${artist.id}`)}
                  className="px-4 py-2 border border-[#93CAD5] text-[#3593A6] font-semibold rounded-lg hover:bg-[#3593A6] hover:text-white transition"
                >
                  View Profile
                  </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FindArtists;
