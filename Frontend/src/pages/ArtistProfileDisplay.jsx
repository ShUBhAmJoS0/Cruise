import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

const ArtistProfile = () => {
  const { id: artistId } = useParams();

  const [artist, setArtist] = useState(null);
  const [gigs, setGigs] = useState([]); 
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("about");


  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const res = await api.get(`/artist/profile/${artistId}`);
        console.log(res.data.data);

        setArtist(res.data.data);
        setIsFollowing(res.data.data.isFollowing);
      } catch (err) {
        console.error("Failed to fetch artist", err);
      }
    };

    fetchArtist();
  }, [artistId]);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const res = await api.get(`/artist/gig/${artistId}`);
        console.log(res.data.data);

        setGigs(res.data.data);
      } catch (err) {
        console.error("Failed to fetch gigs", err);
      }
    };

    fetchGigs();
  }, [artistId]);

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading artist profile...
      </div>
    );
  }

  const formatNumber = (num = 0) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
    return num;
  };


  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await api.post(`/artist/unfollow/${artist.id}`);
        setIsFollowing(false);
        setArtist((prev) => ({
          ...prev,
          followersCount: prev.followersCount - 1,
        }));
      } else {
        await api.post(`/artist/follow/${artist.id}`);
        setIsFollowing(true);
        setArtist((prev) => ({
          ...prev,
          followersCount: prev.followersCount + 1,
        }));
      }
    } catch (err) {
      console.error("Follow toggle failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* COVER */}
      <div className="relative h-56 bg-[#3593A6]">
        <img
          src={artist.coverImage}
          alt="cover"
          className="w-full h-full object-cover opacity-60"
        />

        <div className="absolute -bottom-14 left-6">
          <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-white">
            <img
              src={artist.profileImage}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="px-6 pt-20 pb-6 flex flex-col md:flex-row md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{artist.name}</h1>
          <p className="text-gray-500 mt-1">{artist.bio}</p>

          <div className="flex gap-6 mt-4">
            <div>
              <span className="font-semibold">
                {formatNumber(artist.followersCount)}
              </span>{" "}
              <span className="text-gray-500">Followers</span>
            </div>
            <div>
              <span className="font-semibold">
                {formatNumber(artist.followingCount)}
              </span>{" "}
              <span className="text-gray-500">Following</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleFollowToggle}
          className={`px-6 py-2 rounded-full font-semibold transition ${
            isFollowing
              ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
              : "bg-[#3593A6] text-white hover:bg-[#2c7f8f]"
          }`}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>

      <div className="px-6 border-b flex gap-8">
        {["about", "events", "merch", "reviews"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 capitalize ${
              activeTab === tab
                ? "border-b-2 border-[#3593A6] text-[#3593A6]"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === "about" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-3">
                About {artist.name}
              </h2>
              <p className="text-gray-700">{artist.bio}</p>
            </div>
          )}
        </div>

        <div>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Upcoming Gigs</h2>

            {gigs.length > 0 ? (
              gigs.map((gig) => (
                <div key={gig.id} className="border rounded-lg p-3 mb-3">
                  <h3 className="font-semibold">{gig.name}</h3>
                  <p className="text-sm text-gray-500">{gig.status}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No upcoming gigs</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
