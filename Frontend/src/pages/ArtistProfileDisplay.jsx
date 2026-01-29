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
  X,
  Images,
  Quote,
  Crown
} from "lucide-react";
import toast from "react-hot-toast";

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
    fetchAllgigs();
    fetchReviews();
    fetchMerch();
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

  const getImageUrl = (pathOrBlob) => {
    if (!pathOrBlob) return "/images/defaultprofilepic.png";
    if (pathOrBlob.startsWith("http") || pathOrBlob.startsWith("blob:")) return pathOrBlob;
    return `http://localhost:5000/${pathOrBlob}`;
  };

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
      setAllgigs(res.data.data)
    } catch (error) {
      console.log("failed to fetch all gigs", error.message)
    }
  }

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
      toast.success("Added to cart successfully!")
    } catch (err) {
      console.error("Failed to add to cart:", err);
      toast.error("Failed to add to cart.");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!reviewComment.trim()) {
      toast.error("Please write a review");
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post("/api/reviews", {
        artistId: artistId,
        comment: reviewComment,
      });

      setReviewComment("");
      toast.success("Review posted successfully!");
      fetchReviews();
    } catch (err) {
      console.error("Failed to post review:", err);
      toast.error("Failed to post review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
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
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
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
            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#3593A6]" />
                Artist Stats
              </h3>
              <div className="space-y-4">
                <div
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-[#3593A6]/5 transition-all"
                  onClick={fetchFollowers}
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-bold text-slate-600">Followers</span>
                  </div>
                  <span className="font-black text-slate-900">{formatNumber(followersCount)}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-bold text-slate-600">Following</span>
                  </div>
                  <span className="font-black text-slate-900">{formatNumber(artist?.followingCount || 0)}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-bold text-slate-600">Events</span>
                  </div>
                  <span className="font-black text-slate-900">{allgigs.length}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-bold text-slate-600">Merch</span>
                  </div>
                  <span className="font-black text-slate-900">{merch.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#3593A6]" />
                Connect
              </h3>
              <div className="space-y-3">
                <button
                  onClick={handleFollowToggle}
                  className={`w-full px-4 py-4 rounded-2xl font-black transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${isFollowing
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-[#3593A6] text-white hover:bg-[#0a0f18] hover:shadow-cyan-200"
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
                    className="w-full px-4 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-black shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                )}
              </div>
            </div>

            {/* Recent Reviews Sidebar */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#3593A6]" />
                  Latest Word
                </h3>
                <div className="space-y-4">
                  {reviews.slice(0, 2).map((review) => (
                    <div key={review.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-start gap-3 mb-2">
                        <img
                          src={`http://localhost:5000/${review.reviewer.profileImage}`}
                          alt={review.reviewer.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
                          onError={(e) => { e.target.src = 'http://localhost:5000/uploads/events/defaultprofilepic.png'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-slate-700 truncate">{review.reviewer.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed italic line-clamp-3">"{review.comment}"</p>
                    </div>
                  ))}
                  {reviews.length > 2 && (
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className="w-full text-center text-xs text-[#3593A6] font-black hover:underline uppercase tracking-widest pt-2"
                    >
                      All reviews ({reviews.length})
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-8">
            {/* Artist Header */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8 md:p-10">
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">{artist?.name}</h1>
                    <Award className="w-10 h-10 text-yellow-500 drop-shadow-sm" />
                  </div>
                  {artist?.bio && (
                    <p className="text-xl text-slate-500 font-medium mb-6 italic leading-relaxed">"{artist.bio}"</p>
                  )}
                  <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-slate-400 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#3593A6]" />
                      <span>Verified Artist</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#3593A6]" />
                      <span>Since {artist?.createdAt ? new Date(artist.createdAt).getFullYear() : '2024'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setActiveTab("events")}
                    className="px-8 py-4 bg-[#3593A6] text-white rounded-2xl font-black shadow-lg hover:bg-[#0a0f18] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    View Gigs
                  </button>
                  <button
                    onClick={() => setActiveTab("merch")}
                    className="px-8 py-4 bg-white border-2 border-slate-100 text-slate-900 rounded-2xl font-black hover:border-[#3593A6] hover:text-[#3593A6] transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Merch Store
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-[2rem] shadow-lg border border-slate-100 p-2 overflow-x-auto no-scrollbar">
              <div className="flex gap-2">
                {[
                  { id: "about", label: "About", icon: User },
                  { id: "events", label: "Events", icon: Calendar, count: allgigs.length },
                  { id: "merch", label: "Store", icon: Package, count: merch.length },
                  { id: "reviews", label: "Reviews", icon: MessageSquare, count: reviews.length }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-8 py-4 rounded-[1.5rem] font-black transition-all whitespace-nowrap uppercase tracking-widest text-xs ${activeTab === tab.id
                        ? "bg-[#3593A6] text-white shadow-lg"
                        : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                      }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {tab.count !== undefined && (
                      <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] ${activeTab === tab.id ? "bg-white/20" : "bg-slate-100 text-slate-400"
                        }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
              {activeTab === "about" && (
                <div className="space-y-8">
                  <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-[#3593A6]/10 rounded-[1.25rem] flex items-center justify-center">
                        <User className="w-7 h-7 text-[#3593A6]" />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Biography</h2>
                    </div>

                    {artist?.about ? (
                      <div className="prose prose-lg max-w-none text-slate-600 font-medium leading-relaxed">
                        {artist.about.split('\n').map((paragraph, index) => (
                          <p key={index} className="mb-6">{paragraph}</p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 italic">No detailed biography provided.</p>
                    )}

                    {/* Media Gallery */}
                    {artist?.mediaImages && artist.mediaImages.length > 0 && (
                      <div className="mt-12 pt-12 border-t border-slate-100">
                        <div className="flex items-center gap-4 mb-8">
                          <div className="w-14 h-14 bg-[#3593A6]/10 rounded-[1.25rem] flex items-center justify-center">
                            <Images className="w-7 h-7 text-[#3593A6]" />
                          </div>
                          <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Gallery</h3>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          {artist.mediaImages.map((image, index) => (
                            <div
                              key={index}
                              className="group relative aspect-square overflow-hidden rounded-3xl bg-slate-100 cursor-pointer shadow-sm hover:shadow-xl transition-all"
                              onClick={() => window.open(`http://localhost:5000/${image}`, '_blank')}
                            >
                              <img
                                src={`http://localhost:5000/${image}`}
                                alt={`Work ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Eye className="w-10 h-10 text-white" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "events" && (
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-[#3593A6]/10 rounded-[1.25rem] flex items-center justify-center">
                        <Calendar className="w-7 h-7 text-[#3593A6]" />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Live Performances</h2>
                    </div>
                  </div>

                  {allgigs.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                      <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-xl font-bold text-slate-400">No scheduled events at the moment.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {allgigs.map((event) => (
                        <div
                          key={event.id}
                          className="group bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all cursor-pointer"
                          onClick={() => navigate(`/event/${event.id}`)}
                        >
                          <div className="relative h-56 overflow-hidden">
                            <img
                              src={`http://localhost:5000/${event.profileImage}`}
                              alt={event.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="bg-[#0a0f18]/90 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border border-white/10">
                                {event.category || 'Gig'}
                              </span>
                            </div>
                          </div>
                          <div className="p-8">
                            <h3 className="text-2xl font-black text-slate-900 mb-2 truncate">{event.name}</h3>
                            <div className="flex items-center gap-3 text-slate-400 font-bold text-sm mb-6">
                              <Clock className="w-4 h-4 text-[#3593A6]" />
                              <span>{new Date(event.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                              <span className="text-2xl font-black text-slate-900">NPR {event.price || 'Free'}</span>
                              <div className="w-12 h-12 bg-[#3593A6] text-white rounded-2xl flex items-center justify-center group-hover:bg-[#0a0f18] transition-colors shadow-lg">
                                <ChevronRight className="w-6 h-6" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "merch" && (
                <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-14 h-14 bg-[#3593A6]/10 rounded-[1.25rem] flex items-center justify-center">
                      <Package className="w-7 h-7 text-[#3593A6]" />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Store</h2>
                  </div>

                  {merch.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 rounded-[2rem]">
                      <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <p className="text-xl font-bold text-slate-400">Merchant store is currently offline.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                      {merch.map((item) => (
                        <div
                          key={item.productId}
                          className="group bg-white border border-slate-100 rounded-[2rem] overflow-hidden hover:shadow-2xl hover:border-[#3593A6]/20 transition-all"
                        >
                          <div className="relative h-72 overflow-hidden bg-slate-100">
                            <img
                              src={`http://localhost:5000/${item.productImage}`}
                              alt={item.productName}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            {item.productQuantity === 0 && (
                              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                <span className="bg-slate-900 text-white px-6 py-2 rounded-full font-black uppercase text-xs tracking-widest">Sold Out</span>
                              </div>
                            )}
                          </div>

                          <div className="p-8">
                            <div className="text-[10px] font-black text-[#3593A6] uppercase tracking-[0.2em] mb-2">{item.productCategory}</div>
                            <h3 className="font-extrabold text-xl text-slate-900 mb-2 truncate">{item.productName}</h3>
                            <div className="text-2xl font-black text-slate-900 mb-6">NPR {parseFloat(item.productPrice).toLocaleString()}</div>

                            <button
                              disabled={item.productQuantity === 0}
                              onClick={() => handleAddToCart(item)}
                              className="w-full py-4 bg-[#3593A6] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#0a0f18] disabled:bg-slate-100 disabled:text-slate-400 transition-all shadow-lg active:scale-95"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Add To Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-8">
                  {/* Review Form */}
                  <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-10">
                    <div className="flex items-center gap-4 mb-8">
                      <div className="w-14 h-14 bg-[#3593A6]/10 rounded-[1.25rem] flex items-center justify-center">
                        <MessageSquare className="w-7 h-7 text-[#3593A6]" />
                      </div>
                      <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Review Artist</h2>
                    </div>

                    <form onSubmit={handleSubmitReview} className="space-y-6">
                      <textarea
                        placeholder="Write your review here..."
                        className="w-full p-8 bg-slate-50 border-2 border-transparent rounded-[2rem] resize-none focus:bg-white focus:border-[#3593A6] focus:outline-none transition-all min-h-[160px] text-lg font-medium text-slate-800 placeholder:text-slate-300"
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={submittingReview || !reviewComment.trim()}
                          className="px-12 py-5 bg-[#3593A6] text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-[#0a0f18] disabled:opacity-50 transition-all shadow-xl active:scale-95 flex items-center gap-2"
                        >
                          {submittingReview ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <ThumbsUp className="w-4 h-4" />}
                          Submit Review
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Reviews Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 hover:shadow-2xl transition-all border-b-4 border-b-[#3593A6]">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={`http://localhost:5000/${review.reviewer.profileImage}`}
                              alt={review.reviewer.name}
                              className="w-14 h-14 rounded-full object-cover ring-4 ring-slate-50 shadow-md"
                              onError={(e) => { e.target.src = 'http://localhost:5000/uploads/events/defaultprofilepic.png'; }}
                            />
                            <div>
                              <h4 className="font-black text-slate-900 text-lg leading-none mb-1">{review.reviewer.name}</h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatDate(review.createdAt)}</p>
                            </div>
                          </div>
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                            <Quote className="w-5 h-5 text-slate-200" />
                          </div>
                        </div>
                        <p className="text-lg text-slate-600 font-medium leading-relaxed italic">"{review.comment}"</p>
                        <div className="mt-6 flex gap-1">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-[#3593A6] text-[#3593A6]" />)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ArtistProfile;