import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { ArtistNavbar } from "../component/ArtistNavBar";
import {
  MessageSquare,
  User,
  Star,
  Calendar,
  Award,
  TrendingUp,
  Users,
  Heart,
  ThumbsUp,
  Quote,
  Clock,
  MapPin,
  Sparkles,
  Crown,
  Zap,
  BarChart3,
  Target
} from "lucide-react";

const Fetchuserreviews = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get("/api/reviews/all");
      setReviews(response.data.data);

      // Calculate stats for this artist's reviews
      const totalReviews = response.data.data.length;
      const uniqueReviewers = new Set(response.data.data.map(r => r.userId)).size;
      const avgLength = totalReviews > 0 ? Math.round(
        response.data.data.reduce((sum, r) => sum + r.comment.length, 0) / totalReviews
      ) : 0;

      // Calculate recent reviews (last 7 days)
      const recentReviews = response.data.data.filter(r => {
        const reviewDate = new Date(r.createdAt);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return reviewDate > weekAgo;
      }).length;

      setStats({
        totalReviews,
        uniqueReviewers,
        avgLength,
        recentReviews
      });
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
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

  const getImageUrl = (pathOrBlob) => {
    if (!pathOrBlob) return "/images/defaultprofilepic.png";
    if (pathOrBlob.startsWith("http") || pathOrBlob.startsWith("blob:")) return pathOrBlob;
    return `http://localhost:5000/${pathOrBlob}`;
  };

  const filteredReviews = reviews.filter(review => {
    if (filter === "all") return true;
    // You can add more filter options here
    return true;
  });

  if (isLoading) {
    return (
      <>
        <ArtistNavbar />
        <div className="min-h-screen bg-slate-50 pt-16 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#3593A6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading reviews...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ArtistNavbar />
      <div className="min-h-screen bg-slate-50 pt-16 md:ml-[23%]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] rounded-2xl flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-1">My Reviews</h1>
                    <p className="text-slate-600">See what fans are saying about your work</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="bg-slate-50 rounded-xl p-4 text-center min-w-[120px]">
                    <div className="text-2xl font-bold text-[#3593A6]">{stats.totalReviews}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">Total Reviews</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center min-w-[120px]">
                    <div className="text-2xl font-bold text-emerald-600">{stats.uniqueReviewers}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">Happy Fans</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center min-w-[120px]">
                    <div className="text-2xl font-bold text-purple-600">{stats.recentReviews || 0}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">This Week</div>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 text-center min-w-[120px]">
                    <div className="text-2xl font-bold text-amber-600">{stats.avgLength}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide">Avg Length</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-2 mb-8">
            <div className="flex gap-2 flex-wrap">
              {[
                { id: "all", label: "All Reviews", count: reviews.length, icon: MessageSquare },
                { id: "recent", label: "This Week", count: reviews.filter(r => {
                  const reviewDate = new Date(r.createdAt);
                  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                  return reviewDate > weekAgo;
                }).length, icon: Clock },
                { id: "positive", label: "Highly Rated", count: reviews.filter(r => r.comment.length > 100).length, icon: Star }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-3 rounded-xl font-semibold transition-all ${
                    filter === tab.id
                      ? "bg-[#3593A6] text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    filter === tab.id ? "bg-white/20" : "bg-slate-200"
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Review Header */}
                <div className="bg-gradient-to-r from-[#3593A6]/10 to-[#2d7a8a]/10 p-6 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#3593A6] rounded-full flex items-center justify-center">
                        <Quote className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">Fan Review</h3>
                        <p className="text-sm text-slate-500">{formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="p-6">
                  {/* Reviewer Info */}
                  <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-2xl">
                    <img
                      src={getImageUrl(review.reviewer?.profileImage)}
                      alt={review.reviewer?.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-slate-800">{review.reviewer?.name}</h4>
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span className="text-sm text-slate-500">Verified Fan</span>
                      </div>
                      <p className="text-sm text-slate-600">{review.reviewer?.email}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400 mb-1">Review #{review.id}</div>
                      <div className="flex items-center gap-1 text-emerald-600">
                        <ThumbsUp className="w-3 h-3" />
                        <span className="text-xs font-medium">Helpful</span>
                      </div>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="mb-6">
                    <blockquote className="text-slate-700 leading-relaxed text-lg italic border-l-4 border-[#3593A6] pl-4">
                      "{review.comment}"
                    </blockquote>
                  </div>

                  {/* Artist Info */}
                  <div className="border-t border-slate-100 pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Crown className="w-5 h-5 text-yellow-500" />
                      <span className="font-semibold text-slate-800">Reviewed Artist</span>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100">
                      <img
                        src={getImageUrl(review.artist?.profileImage)}
                        alt={review.artist?.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-bold text-slate-800 text-lg">{review.artist?.name}</h5>
                          <Award className="w-4 h-4 text-yellow-500" />
                        </div>
                        <p className="text-sm text-slate-600 line-clamp-2 mb-2">
                          {review.artist?.bio || "Passionate artist creating amazing experiences"}
                        </p>
                        {review.artist?.social && (
                          <a
                            href={review.artist.social}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-[#3593A6] hover:text-[#2d7a8a] font-medium transition-colors"
                          >
                            <Sparkles className="w-3 h-3" />
                            View Profile
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Footer */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{Math.ceil(review.comment.length / 50)} min read</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-4 h-4" />
                        <span>{review.comment.length} chars</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                        <Heart className="w-4 h-4 text-slate-400 hover:text-red-500" />
                      </button>
                      <button className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                        <ThumbsUp className="w-4 h-4 text-slate-400 hover:text-[#3593A6]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredReviews.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-12 max-w-md mx-auto">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No reviews yet</h3>
                <p className="text-slate-500 mb-6">
                  {filter === "all"
                    ? "No fans have reviewed your work yet. Reviews will appear here once people start sharing their feedback about your events and merchandise."
                    : filter === "recent"
                    ? "No new reviews this week. Keep creating amazing content and reviews will start coming in!"
                    : "No reviews match the current filter. Try adjusting your filter criteria."}
                </p>
                <div className="flex justify-center gap-2">
                  <div className="w-2 h-2 bg-[#3593A6] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#3593A6] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-[#3593A6] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}

          {/* My Review Analytics */}
          <div className="mt-12 bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">My Review Analytics</h3>
              <p className="text-slate-600">Insights into how fans perceive your work</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-700 mb-1">{stats.uniqueReviewers}</div>
                <div className="text-sm text-blue-600">Fan Supporters</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-purple-700 mb-1">{stats.recentReviews || 0}</div>
                <div className="text-sm text-purple-600">Recent Reviews</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-emerald-700 mb-1">{stats.avgLength || 0}</div>
                <div className="text-sm text-emerald-600">Avg. Length</div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl border border-amber-200">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-amber-700 mb-1">{stats.totalReviews}</div>
                <div className="text-sm text-amber-600">Total Love</div>
              </div>
            </div>

            {/* Additional Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#3593A6]" />
                  Review Timeline
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">This Week</span>
                    <span className="font-semibold text-[#3593A6]">
                      {reviews.filter(r => {
                        const reviewDate = new Date(r.createdAt);
                        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                        return reviewDate > weekAgo;
                      }).length} reviews
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Last 30 Days</span>
                    <span className="font-semibold text-[#3593A6]">
                      {reviews.filter(r => {
                        const reviewDate = new Date(r.createdAt);
                        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                        return reviewDate > monthAgo;
                      }).length} reviews
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">All Time</span>
                    <span className="font-semibold text-[#3593A6]">{reviews.length} reviews</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-[#3593A6]" />
                  Fan Engagement
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Average Review</span>
                    <span className="font-semibold text-[#3593A6]">{stats.avgLength} chars</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Detailed Reviews</span>
                    <span className="font-semibold text-[#3593A6]">
                      {reviews.filter(r => r.comment.length > 100).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Engaged Fans</span>
                    <span className="font-semibold text-[#3593A6]">
                      {reviews.length > 0 ? Math.round((reviews.filter(r => r.comment.length > 50).length / reviews.length) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Fetchuserreviews;
