import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import Footer from "../components/Footer";
import {
  Calendar,
  MapPin,
  Users,
  Heart,
  Star,
  Package,
  ShoppingCart,
  MessageSquare,
  Eye,
  TrendingUp,
  Music,
  Clock,
  Sparkles,
  Award,
  Zap,
  ChevronRight,
  Instagram,
  ExternalLink,
  Plus,
  User,
  ThumbsUp,
  X
} from "lucide-react";

const ArtistProfile = () => {
  const { id: artistId } = useParams();

  const [artist, setArtist] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [allgigs, setAllgigs] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [merch, setMerch] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [followersCount, setFollowersCount] = useState(0);
  const [followers, setFollowers] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [analytics, setAnalytics] = useState(null);

  const navigate = useNavigate();

    const fetchArtist = async () => {
      try {
        const res = await api.get(`/artist/profile/${artistId}`);
        console.log(res.data.data);
    setFollowersCount(res.data.data.followersCount);
        setArtist(res.data.data.artist);
        setIsFollowing(res.data.data.isFollowing);

      } catch (err) {
        console.error("Failed to fetch artist", err);
      }
    };

  useEffect(() => {
    fetchArtist();
    fetchAnalytics();
  }, [artistId]);

  useEffect(() => {
    if (activeTab === "merch") {
      fetchMerch();
    }
  }, [activeTab,]);

  const fetchMerch = async () => {
    try {
      const res = await api.get(`artist/allmerch/${artistId}`)
      console.log(res.data.data)
      setMerch(res.data.data);
    } catch (error) {
      console.log(error)
    }


  }


  const fetchReviews = async () => {
    try {
  const res = await api.get(`/api/reviews/artist/${artistId}`);
  console.log(res.data.data, "fetched sucessfully all reviews");
      setReviews(res.data.data);
    } catch (error) {
      console.log(error.message)
    }
  }
  useEffect(() => {
    if (activeTab === "reviews") {
      fetchReviews();
    }
  }, [activeTab]);

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

  const fetchAllgigs = async () => {
    try {
      const res = await api.get(`/artist/allgigs/${artistId}`)
      console.log(res.data.data);
      console.log(res.data.message);
      setAllgigs(res.data.data)
    } catch (error) {
      console.log("failed to fetch all gigs", error.message)
    }

  }

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/artist/analytics');
      setAnalytics(res.data.data);
    } catch (error) {
      console.log("failed to fetch analytics", error.message);
    }
  }

  useEffect(() => {
    if (activeTab === "events") {
      fetchAllgigs();
    }
  }, [activeTab]);

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

const fetchFollowers = async () => {
    try {
      const response = await api.get(`/artist/followers/${artistId}`);
      setFollowers(response.data.followers);
      setFollowersCount(response.data.count); 
      setShowFollowers(true);
    } catch (err) {
      console.error("Failed to fetch followers", err);
    }
  };

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await api.post(`/artist/unfollow/${artist.id}`);
        setIsFollowing(false);
        fetchArtist()
      } else {
        await api.post(`/artist/follow/${artist.id}`);
        setIsFollowing(true);
       fetchArtist()
      }
    } catch (err) {
      console.error("Follow toggle failed", err);
    }
  };
  const handleAddToCart = async (product) => {
    try {
      await api.post("/api/cart", {
        productId: product.productId,
        quantity: 1,
      });
      alert("added to cart sucessfully")
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add to cart.");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!reviewComment.trim()) {
      alert("Please write a review");
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post("/api/reviews", {
        artistId: artistId,
        comment: reviewComment,
      });
      
      setReviewComment("");
      alert("Review posted successfully!");
      
      // Refresh reviews
      fetchReviews();
    } catch (err) {
      console.error("Failed to post review:", err);
      alert("Failed to post review.");
    } finally {
      setSubmittingReview(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-80 bg-gradient-to-r from-[#3593A6] via-[#2d7a8a] to-[#1e5f6f] relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
        

          {artist?.coverImage && (
            <img
              src={`http://localhost:5000/${artist.coverImage}`}
              alt="cover"
              className="w-full h-full object-cover mix-blend-overlay"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        </div>

        {/* Profile Picture */}
        <div className="absolute -bottom-16 left-8 md:left-12">
          <div className="relative">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-4 border-white overflow-hidden bg-white shadow-2xl ring-4 ring-white/20">
              <img
                src={`http://localhost:5000/${artist?.profileImage || 'uploads/events/defaultprofilepic.png'}`}
                alt={artist?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Artist Stats & Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Artist Stats */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#3593A6]" />
                Artist Stats
              </h3>
              <div className="space-y-4">
                <div
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
                  onClick={fetchFollowers}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600">Followers</span>
                  </div>
                  <span className="font-bold text-slate-800">{formatNumber(followersCount)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600">Following</span>
                  </div>
                  <span className="font-bold text-slate-800">{formatNumber(artist?.followingCount || 0)}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600">Events</span>
                  </div>
                  <span className="font-bold text-slate-800">{allgigs.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-500" />
                    <span className="text-sm text-slate-600">Merch Items</span>
                  </div>
                  <span className="font-bold text-slate-800">{merch.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#3593A6]" />
                Connect
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleFollowToggle}
                  className={`w-full px-4 py-3 rounded-2xl font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                    isFollowing
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] text-white hover:shadow-xl hover:scale-105"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current' : ''}`} />
                  {isFollowing ? "Following" : "Follow Artist"}
                </button>

                {artist?.social && (
                  <a
                    href={artist.social}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full px-4 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                )}
              </div>
            </div>

            {/* Recent Reviews */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#3593A6]" />
                  Recent Reviews
                </h3>
                <div className="space-y-3">
                  {reviews.slice(0, 2).map((review) => (
                    <div key={review.id} className="p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-[#3593A6] rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {review.userName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{review.userName}</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">{review.comment}</p>
                    </div>
                  ))}
                  {reviews.length > 2 && (
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className="w-full text-center text-sm text-[#3593A6] hover:text-[#2d7a8a] font-medium transition-colors"
                    >
                      View all {reviews.length} reviews
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Artist Header */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 mb-8">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800">{artist?.name}</h1>
                    <Award className="w-8 h-8 text-yellow-500" />
                  </div>
                  {artist?.bio && (
                    <p className="text-lg text-slate-600 mb-3 italic">"{artist.bio}"</p>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>Artist</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Joined {artist?.createdAt ? new Date(artist.createdAt).getFullYear() : 'Recently'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setActiveTab("events")}
                    className="px-6 py-3 bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    View Events
                  </button>
                  <button
                    onClick={() => setActiveTab("merch")}
                    className="px-6 py-3 bg-white border-2 border-[#3593A6] text-[#3593A6] rounded-2xl font-semibold hover:bg-[#3593A6] hover:text-white transition-all duration-200 flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Shop Merch
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-2 mb-8">
              <div className="flex gap-2 overflow-x-auto">
                {[
                  { id: "about", label: "About", icon: User },
                  { id: "events", label: "Events", icon: Calendar, count: allgigs.length },
                  { id: "merch", label: "Merchandise", icon: Package, count: merch.length },
                  { id: "reviews", label: "Reviews", icon: MessageSquare, count: reviews.length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] text-white shadow-lg"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.id ? "bg-white/20" : "bg-slate-200"
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {activeTab === "about" && (
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] rounded-2xl flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">About {artist?.name}</h2>
                  </div>

                  {artist?.about ? (
                    <div className="prose prose-lg max-w-none text-slate-700 leading-relaxed">
                      {artist.about.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4">{paragraph}</p>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-10 h-10 text-slate-400" />
                      </div>
                      <p className="text-slate-500 text-lg">No bio available yet.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "events" && (
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] rounded-2xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">Upcoming Events</h2>
                        <p className="text-slate-600">Discover {artist?.name}'s performances</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#3593A6]">{allgigs.length}</div>
                      <div className="text-sm text-slate-500">Total Events</div>
                    </div>
                  </div>

                  {allgigs.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-700 mb-2">No events yet</h3>
                      <p className="text-slate-500">Check back soon for upcoming performances!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {allgigs.map((event) => (
                        <div
                          key={event.id}
                          className="group bg-white border-2 border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-[#3593A6]/30 transition-all duration-300 cursor-pointer"
                          onClick={() => navigate(`/event/${event.id}`)}
                        >
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={`http://localhost:5000/${event.profileImage}`}
                              alt={event.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-4 left-4 right-4">
                              <h3 className="text-xl font-bold text-white mb-1">{event.name}</h3>
                              <div className="flex items-center gap-2 text-white/90 text-sm">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(event.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-6">
                            <p className="text-slate-600 mb-4 line-clamp-2">{event.description}</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-slate-500 text-sm">
                                <MapPin className="w-4 h-4" />
                                <span>{event.location}</span>
                              </div>
                              <button className="px-4 py-2 bg-[#3593A6] text-white rounded-xl hover:bg-[#2d7a8a] transition-colors font-medium flex items-center gap-2 group-hover:shadow-lg">
                                View Details
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "merch" && (
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] rounded-2xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">Official Merchandise</h2>
                        <p className="text-slate-600">Support {artist?.name} with exclusive merch</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#3593A6]">{merch.length}</div>
                      <div className="text-sm text-slate-500">Items Available</div>
                    </div>
                  </div>

                  {merch.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-700 mb-2">No merchandise yet</h3>
                      <p className="text-slate-500">Official merch coming soon!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {merch.map((item) => (
                        <div
                          key={item.productId}
                          className="group bg-white border-2 border-slate-100 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-[#3593A6]/30 transition-all duration-300"
                        >
                          <div className="relative h-64 overflow-hidden">
                            <img
                              src={`http://localhost:5000/${item.productImage}`}
                              alt={item.productName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            {item.productQuantity === 0 && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                                  Out of Stock
                                </span>
                              </div>
                            )}
                            <div className="absolute top-3 right-3">
                              <span className="bg-white/90 backdrop-blur-sm text-slate-800 px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                                {item.productCategory}
                              </span>
                            </div>
                          </div>

                          <div className="p-6">
                            <h3 className="font-bold text-xl text-slate-800 mb-2 line-clamp-1">{item.productName}</h3>
                            <p className="text-slate-600 mb-4 line-clamp-2">{item.productDescription}</p>

                            <div className="flex items-center justify-between mb-4">
                              <span className="text-2xl font-bold text-[#3593A6]">
                                NPR {parseFloat(item.productPrice).toLocaleString()}
                              </span>
                              <div className="flex items-center gap-1 text-sm text-slate-500">
                                <Package className="w-4 h-4" />
                                <span>{item.productQuantity} left</span>
                              </div>
                            </div>

                            <button
                              disabled={item.productQuantity === 0}
                              onClick={() => handleAddToCart(item)}
                              className={`w-full py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                                item.productQuantity === 0
                                  ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                                  : "bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] text-white hover:shadow-xl hover:scale-105"
                              }`}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              {item.productQuantity === 0 ? "Out of Stock" : "Add to Cart"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  {/* Review Form */}
                  <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] rounded-2xl flex items-center justify-center">
                        <MessageSquare className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">Share Your Thoughts</h2>
                        <p className="text-slate-600">Leave a review for {artist?.name}</p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div className="relative">
                        <textarea
                          placeholder="Write your review here... Share what you love about this artist's work!"
                          className="w-full p-4 border-2 border-slate-200 rounded-2xl resize-none focus:border-[#3593A6] focus:ring-2 focus:ring-[#3593A6]/20 focus:outline-none transition-all min-h-[120px] text-slate-700 placeholder:text-slate-400"
                          rows={4}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                          {reviewComment.length}/500
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={submittingReview || !reviewComment.trim()}
                          className={`px-8 py-3 rounded-2xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                            submittingReview || !reviewComment.trim()
                              ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                              : "bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] text-white hover:shadow-xl hover:scale-105"
                          }`}
                        >
                          {submittingReview ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Posting...
                            </>
                          ) : (
                            <>
                              <ThumbsUp className="w-4 h-4" />
                              Post Review
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Reviews List */}
                  <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] rounded-2xl flex items-center justify-center">
                          <Star className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-slate-800">Fan Reviews</h2>
                          <p className="text-slate-600">What fans are saying about {artist?.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#3593A6]">{reviews.length}</div>
                        <div className="text-sm text-slate-500">Total Reviews</div>
                      </div>
                    </div>

                    {reviews.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <MessageSquare className="w-10 h-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-700 mb-2">No reviews yet</h3>
                        <p className="text-slate-500">Be the first to share your thoughts about this artist!</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border-2 border-slate-100 rounded-2xl p-6 hover:border-[#3593A6]/30 transition-colors"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-lg">
                                  {review.userName.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="font-bold text-lg text-slate-800">{review.userName}</h4>
                                  <span className="text-sm text-slate-500 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 mb-3">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                  {review.comment}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Followers Modal */}
      {showFollowers && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-800">
                  Followers ({followersCount})
                </h2>
                <button
                  onClick={() => setShowFollowers(false)}
                  className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              {followers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500">No followers yet</p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {followers.map(follower => (
                    <div key={follower.id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                      <img
                        src={`http://localhost:5000/${follower.profileImage || 'uploads/events/defaultprofilepic.png'}`}
                        alt={follower.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{follower.name}</p>
                        <p className="text-sm text-slate-500 truncate">{follower.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ArtistProfile;