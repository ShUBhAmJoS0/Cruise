import React, { useEffect, useState } from "react";
import api from "../api/axios"; // adjust your API path
import { useNavigate } from "react-router-dom";

function FindArtists() {
  const [artists, setArtists] = useState([]);
  const [activeTab, setActiveTab] = useState("discover"); // "discover" or "following"
  const navigate = useNavigate();

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const res = await api.get("/artist/all");
      console.log(res.data);
      setArtists(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFollow = async (artistId, index) => {
    const artist = artists[index];
    const wasFollowing = artist.isFollowing;
    try {
      if (wasFollowing) {
        await api.post(`/artist/unfollow/${artistId}`);
        fetchArtists();
      } else {
        await api.post(`/artist/follow/${artistId}`);
        fetchArtists();
      }
    } catch (error) {
      console.error("Follow toggle failed", error);
    }
  };

  const followingArtists = artists.filter(artist => artist.isFollowing);
  const discoverArtists = artists.filter(artist => !artist.isFollowing);

  const displayedArtists = activeTab === "following" ? followingArtists : discoverArtists;

  if (!artists || artists.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading all artist profiles...
      </div>
    );
  }
    const topFollowedArtists = [...discoverArtists]
    .sort((a, b) => b.followersCount - a.followersCount)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10 mt-20">
      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex gap-4 border-b border-gray-300">
          <button
            onClick={() => setActiveTab("discover")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "discover"
                ? "text-[#3593A6] border-b-2 border-[#3593A6]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Discover New Artists
            <span className="ml-2 text-sm bg-gray-200 px-2 py-1 rounded-full">
              {discoverArtists.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "following"
                ? "text-[#3593A6] border-b-2 border-[#3593A6]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Artists You Follow
            <span className="ml-2 text-sm bg-gray-200 px-2 py-1 rounded-full">
              {followingArtists.length}
            </span>
          </button>
        </div>
      </div>
 {activeTab === "discover" && topFollowedArtists.length > 0 && (
        <div className="max-w-7xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Top Followed Artists</h2>
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {topFollowedArtists.map((artist) => {
              const actualIndex = artists.findIndex(a => a.id === artist.id);
              
              return (
                <div
                  key={artist.id}
                  className="flex-shrink-0 w-48 group cursor-pointer"
                  onClick={() => navigate(`/artist/profile/${artist.id}`)}
                >
                  <div className="relative">
                    {/* Circular Profile Image - Spotify Style */}
                    <div className="w-48 h-48 rounded-full overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-300">
                      <img
                        src={
                          
                             `http://localhost:5000/${artist.profileImage}`
                         
                        }
                        alt={artist.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    
                    {/* Overlay with buttons on hover */}
                    <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-40 rounded-full transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFollow(artist.id, actualIndex);
                          }}
                          className="px-4 py-2 bg-[#3593A6] text-white rounded-full font-semibold hover:bg-[#2c7f8f] transition shadow-lg"
                        >
                          Follow
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Artist Info */}
                  <div className="mt-4 text-center">
                    <h3 className="font-bold text-gray-800 text-lg truncate">
                      {artist.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {artist.followersCount.toLocaleString()} followers
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Artists Grid */}
      {displayedArtists.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-400 text-6xl mb-4">
            {activeTab === "following" ? "👥" : "🎨"}
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {activeTab === "following" 
              ? "You're not following any artists yet" 
              : "No new artists to discover"}
          </h3>
          <p className="text-gray-500">
            {activeTab === "following"
              ? "Start following artists to see them here"
              : "Check back later for new artists"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {displayedArtists.map((artist, index) => {
            // Get the actual index in the full artists array for handleFollow
            const actualIndex = artists.findIndex(a => a.id === artist.id);
            
            return (
              <div
                key={artist.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className="relative">
                  <img
                    src={
                      artist.coverImage
                        ? `http://localhost:5000/${artist.coverImage}`
                        : "/images/defaultcover.png"
                    }
                    alt="Cover"
                    className="w-full h-36 object-cover"
                  />
                  <img
                    src={
                      artist.profileImage
                        ? `http://localhost:5000/${artist.profileImage}`
                        : "/images/defaultprofilepic.png"
                    }
                    alt={artist.name}
                    className="w-20 h-20 rounded-full border-4 border-white absolute -bottom-10 left-1/2 transform -translate-x-1/2 object-cover shadow-md"
                  />
                </div>
                <div className="pt-12 pb-6 px-4 flex flex-col items-center text-center">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {artist.name}
                  </h2>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {artist.bio || "No bio available"}
                  </p>
                  
                  {/* Followers Count */}
                  <div className="mt-3 text-sm text-gray-600">
                    <span className="font-semibold">{artist.followersCount}</span>{" "}
                    {artist.followersCount === 1 ? "follower" : "followers"}
                  </div>

                  <div className="mt-4 flex gap-2 w-full">
                    <button
                      onClick={() => handleFollow(artist.id, actualIndex)}
                      className={`flex-1 px-4 h-10 rounded-md font-semibold transition ${
                        artist.isFollowing
                          ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
                          : "bg-[#3593A6] text-white hover:bg-[#2c7f8f]"
                      }`}
                    >
                      {artist.isFollowing ? "Following" : "Follow"}
                    </button>
                    <button
                      onClick={() => navigate(`/artist/profile/${artist.id}`)}
                      className="flex-1 px-4 py-2 border border-[#93CAD5] text-[#3593A6] font-semibold rounded-lg hover:bg-[#3593A6] hover:text-white transition"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FindArtists;
