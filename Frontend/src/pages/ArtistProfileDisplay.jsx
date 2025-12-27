
import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

// Fake Database - Replace with backend later
const FAKE_DB = {
  artist: {
    id: 1,
    name: "TAYLOR SWIFT",
    profession: "American singer-songwriter",
    followers: 80400000,
    following: 2189,
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    coverImage: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&h=400&fit=crop",
    about: "Taylor Swift is an American singer-songwriter known for her storytelling, genre versatility, and record-breaking success.",
    galleryImages: [
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=300&h=400&fit=crop",
      "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=400&fit=crop"
    ]
  },
  upcomingGigs: [
    { id: 1, name: "The Eras Tour", status: "confirmed", availability: "Available Slot" },
    { id: 2, name: "Red Tour", status: "pending", availability: "Open for offer" }
  ],
  currentUser: {
    id: 101,
    username: "current_user"
  },
  // This tracks follow relationships
  follows: [
    // { followerId: 101, followingId: 1 } means user 101 follows artist 1
  ]
};

const ArtistProfile = () => {
  const [artist] = useState(FAKE_DB.artist);
  const [upcomingGigs] = useState(FAKE_DB.upcomingGigs);
  const [currentUser] = useState(FAKE_DB.currentUser);
  const [follows, setFollows] = useState(FAKE_DB.follows);
  const [activeTab, setActiveTab] = useState('about');
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Check if current user follows this artist
  const isFollowing = follows.some(
    f => f.followerId === currentUser.id && f.followingId === artist.id
  );

  // Calculate follower count
  const followerCount = follows.filter(f => f.followingId === artist.id).length + artist.followers;

  const handleFollowToggle = () => {
    if (isFollowing) {
      // Unfollow
      setFollows(follows.filter(
        f => !(f.followerId === currentUser.id && f.followingId === artist.id)
      ));
    } else {
      // Follow
      setFollows([...follows, { followerId: currentUser.id, followingId: artist.id }]);
    }
  };

  const nextImage = () => {
    setGalleryIndex((prev) => (prev + 1) % artist.galleryImages.length);
  };

  const prevImage = () => {
    setGalleryIndex((prev) => (prev - 1 + artist.galleryImages.length) % artist.galleryImages.length);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Cover Image */}
      <div className="relative h-48 md:h-64 bg-gradient-to-b from-gray-800 to-black">
        <img 
          src={artist.coverImage} 
          alt="Cover" 
          className="w-full h-full object-cover opacity-50"
        />
        {/* Profile Picture - Overlapping */}
        <div className="absolute -bottom-12 left-4 md:left-8">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-black overflow-hidden">
            <img 
              src={artist.profileImage} 
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="px-4 md:px-8 pt-16 pb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{artist.name}</h1>
            <p className="text-gray-400 text-sm md:text-base">{artist.profession}</p>
            
            <div className="flex gap-6 mt-3 text-sm">
              <div className="flex items-center gap-1">
                <span className="font-semibold">{formatNumber(followerCount)}</span>
                <span className="text-gray-400">Followers</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{formatNumber(artist.following)}</span>
                <span className="text-gray-400">Following</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleFollowToggle}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              isFollowing 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mt-8 border-b border-gray-800 overflow-x-auto">
          {['About', 'Upcoming Events', 'Past Events', 'Merchandise', 'Reviews'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().replace(' ', ''))}
              className={`pb-3 px-2 whitespace-nowrap transition-colors ${
                activeTab === tab.toLowerCase().replace(' ', '')
                  ? 'text-blue-500 border-b-2 border-blue-500'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="px-4 md:px-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* About Section */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">About Taylor Swift</h2>
              <p className="text-gray-300 leading-relaxed">{artist.about}</p>
            </div>

            {/* Media Gallery */}
            <div className="bg-gray-900 rounded-lg p-6 mt-6">
              <h2 className="text-xl font-bold mb-4">Media Gallery</h2>
              <div className="relative">
                <div className="flex gap-4 overflow-hidden">
                  <div className="flex transition-transform duration-300 ease-in-out" 
                       style={{ transform: `translateX(-${galleryIndex * 100}%)` }}>
                    {artist.galleryImages.map((img, idx) => (
                      <div key={idx} className="min-w-full grid grid-cols-2 md:grid-cols-4 gap-4">
                        {artist.galleryImages.slice(idx, idx + 4).map((image, i) => (
                          <div key={i} className="aspect-[3/4] rounded-lg overflow-hidden">
                            <img 
                              src={image} 
                              alt={`Gallery ${i}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Upcoming Gigs Sidebar */}
          <div>
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Upcoming Gigs</h2>
                <Calendar className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-4">
                {upcomingGigs.map((gig) => (
                  <div key={gig.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        gig.status === 'confirmed' 
                          ? 'bg-green-500 bg-opacity-20 text-green-400' 
                          : 'bg-yellow-500 bg-opacity-20 text-yellow-400'
                      }`}>
                        {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{gig.name}</h3>
                    <p className={`text-sm ${
                      gig.status === 'confirmed' ? 'text-green-400' : 'text-blue-400'
                    }`}>
                      {gig.availability}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;