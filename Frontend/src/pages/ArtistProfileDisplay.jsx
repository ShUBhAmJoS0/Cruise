import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

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
    <div className="min-h-screen bg-gray-100">
      {/* COVER */}
      <div className="relative h-56 bg-[#3593A6]">
        <img
          src={`http://localhost:5000/${artist.coverImage}`}
          alt="cover"
          className="w-full h-full object-cover opacity-90"
        />

        <div className="absolute -bottom-14 left-6">
          <div className="w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-white">
            <img
              src={`http://localhost:5000/${artist.profileImage}`}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Followers Modal */}
      {showFollowers && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowFollowers(false)}>
          <div className="bg-white p-1 pl-3 pr-3 rounded-2xl shadow-2xl max-w-md w-full transform animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Followers ({followersCount})
              </h2>
              <button
                onClick={() => setShowFollowers(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="">
              {followers.length === 0 ? (
                <p className="text-center text-gray-500 py-8" >No followers yet</p>
              ) : (
                followers.map(follower => (
                  <div key={follower.id} className="flex items-center gap-3 hover:bg-gray-50 p-3 rounded-lg transition-colors">
                    <img
                      src={follower.profileImage || '/default-avatar.png'}
                      alt={follower.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{follower.name}</p>
                      <p className="text-sm text-gray-500">{follower.email}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="px-6 pt-20 pb-6">
        <div className="flex flex-col md:flex-row md:justify-between gap-4 items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{artist.name}</h1>
            <p className="text-gray-500 mt-1">{artist.bio}</p>
            <a className="text-[#2c7f8f] mt-1 block" href={artist.social}> visit my instagram</a>
            <div className="flex gap-6 mt-4">
              <div className="cursor-pointer" onClick={fetchFollowers}>
                <span className="font-semibold">
                  {formatNumber(followersCount)}
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
            className={`px-4 h-10 rounded-md font-semibold transition ${isFollowing
              ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
              : "bg-[#3593A6] text-white hover:bg-[#2c7f8f]"
              }`}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-6 border-b flex gap-8">
        {["about", "events", "merch", "reviews"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 capitalize ${activeTab === tab
              ? "border-b-2 border-[#3593A6] text-[#3593A6]"
              : "text-gray-500"
              }`
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="px-6 pt-6 pb-12">
        {activeTab === "about" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-3">About {artist.name}</h2>
            <p className="text-gray-700">{artist.about}</p>
          </div>
        )}

        {activeTab === "events" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-3">
              View all events from {artist.name}
            </h2>

            {allgigs.length === 0 && (
              <p className="text-gray-500">No events found for this artist.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allgigs.map((event) => (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={`http://localhost:5000/${event.profileImage}`}
                    alt={event.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                  <h3 className="text-lg font-semibold mb-1">{event.name}</h3>
                  <p className="text-gray-500 text-sm mb-2">
                    {new Date(event.date).toLocaleDateString()} - {event.location}
                  </p>
                  <p className="text-gray-700 text-sm">{event.description}</p>
                  <button className="mt-3 w-full bg-[#3593A6] text-white py-2 rounded hover:bg-[#3eacc2] transition-colors" onClick={() => navigate(`/event/${event.id}`)}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "merch" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">
              Official Merch from{" "}
              <span className="text-[#3593A6]">{artist.name}</span>
            </h2>

            {merch.length === 0 ? (
              <p className="text-gray-500">No merch available yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {merch.map((item) => (
                  <div
                    key={item.id}
                    className="group border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden">
                      <img
                        src={`http://localhost:5000/${item.productImage}`}
                        alt={item.name}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {item.stock === 0 && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col">
                      <h3 className="font-semibold text-lg">{item.productName}</h3>
                      <p className="text-gray-500 text-sm mb-2">
                        {item.productCategory}
                      </p>

                      <div className="flex items-center justify-between ">
                        <span className="text-lg font-bold text-[#3593A6]">
                          ${item.productPrice}
                        </span>
                      </div>
                      <button
                        disabled={item.stock === 0}
                        className={`px-4 py-2 mt-2 text-sm rounded-md transition
                            ${item.stock === 0
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-[#3593A6] text-white hover:bg-[#3eacc2]"
                          }
                          `}
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-6">
              Reviews for{" "}
              <span className="text-[#3593A6]">{artist.name}</span>
            </h2>

            {/* Review Form */}
            <form className="border rounded-lg p-4 mb-8" onSubmit={handleSubmitReview}>
              <h3 className="font-semibold mb-3">Leave a Review</h3>

              <textarea
                placeholder="Write your review here..."
                className="w-full border rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#3593A6]"
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
              />

              <button
                type="submit"
                disabled={submittingReview}
                className="mt-4 bg-[#3593A6] text-white px-6 py-2 rounded-lg hover:bg-[#226471] transition disabled:opacity-50"
              >
                {submittingReview ? "Submitting..." : "Submit Review"}
              </button>
            </form>

            {/* Reviews List */}
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-500">
                  No reviews yet. Be the first to share your thoughts.
                </p>
              ) : (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{review.userName}</h4>
                      <span className="text-gray-400 text-xs">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm whitespace-pre-line">
                      {review.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistProfile;