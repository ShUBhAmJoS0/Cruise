import React, { useState, useEffect } from "react";
import PostCard from "./PostCard";
import api from "../api/axios";
import toast from "react-hot-toast";

function CreatePostModal({ onClose, onSubmit, editPost = null }) {
  const [content, setContent] = useState(editPost?.content || "");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    editPost?.image ? `http://localhost:5000${editPost.image}` : null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(content, image);
      setContent("");
      setImage(null);
      setImagePreview(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">
            {editPost ? "Edit Post" : "Create Post"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full border-2 border-gray-200 rounded-xl p-4 text-lg focus:border-blue-500 focus:outline-none resize-none transition-colors"
            rows="6"
          />

          {imagePreview && (
            <div className="mt-4 relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="rounded-xl max-h-64 w-full object-cover"
              />
              <button
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mt-6">
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg cursor-pointer transition-colors">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">Add Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {editPost ? "Updating..." : "Posting..."}
                </>
              ) : (
                editPost ? "Update" : "Post"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadCurrentUser();
    loadPosts();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const res = await api.get("/api/community/auth/me");
      setCurrentUser(res.data);
      console.log("Current user loaded:", res.data); // Debug log
    } catch (err) {
      console.error("LOAD USER ERROR:", err);

    }
  };

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/community");
      setPosts(res.data || []);
      console.log("Posts loaded:", res.data); // Debug log
    } catch (err) {
      console.error("LOAD POSTS ERROR:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async (content, image) => {
    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) formData.append("image", image);

      await api.post("/api/community", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await loadPosts();
      setShowModal(false);
    } catch (err) {
      console.error("CREATE POST ERROR:", err);
      toast.error("Failed to create post. Please try again.");
    }
  };

  const handleEditPost = async (content, image) => {
    if (!editingPost) return;

    try {
      const formData = new FormData();
      formData.append("content", content);
      if (image) formData.append("image", image);

      await api.put(`/api/community/${editingPost.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await loadPosts();
      setShowModal(false);
      setEditingPost(null);
    } catch (err) {
      console.error("EDIT POST ERROR:", err);
      toast.error("Failed to edit post. Please try again.");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await api.delete(`/api/community/${postId}`);
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    } catch (err) {
      console.error("DELETE POST ERROR:", err);
      toast.error("Failed to delete post. Please try again.");
    }
  };

  const handleLike = async (postId) => {
    try {
      await api.post(`/api/community/${postId}/like`);

      // Update state locally without reloading
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            const hasLiked = post.Likes?.some(like => like.userId === currentUser?.id);
            return {
              ...post,
              Likes: hasLiked
                ? post.Likes.filter(like => like.userId !== currentUser?.id)
                : [...(post.Likes || []), { userId: currentUser?.id }]
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("LIKE ERROR:", err);
    }
  };

  const handleComment = async (postId, content) => {
    try {
      const response = await api.post(`/api/community/${postId}/comment`, {
        content,
      });

      // Update state locally without reloading
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            const newComment = {
              id: response.data?.id || Date.now(),
              content,
              userId: currentUser?.id,
              User: {
                name: currentUser?.name || "You",
                profileImage: currentUser?.profileImage
              }
            };
            return {
              ...post,
              Comments: [...(post.Comments || []), newComment]
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("COMMENT ERROR:", err);
    }
  };

  const handleRepost = async (postId) => {
    try {
      await api.post(`/api/community/${postId}/repost`);

      // Update state locally without reloading
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            const hasReposted = post.Repost?.some(repost => repost.userId === currentUser?.id);
            return {
              ...post,
              Repost: hasReposted
                ? post.Repost.filter(repost => repost.userId !== currentUser?.id)
                : [...(post.Repost || []), { userId: currentUser?.id }]
            };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("REPOST ERROR:", err);
    }
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPost(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-2xl mx-auto px-4 pt-0 pb-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Community</h1>
          <p className="text-gray-600">Share your thoughts and connect with others</p>


          {currentUser && (
            <p className="text-sm text-gray-500 mt-2">
              Logged in as: {currentUser.name} (ID: {currentUser.id})
            </p>
          )}
        </div>

        {/* Create Post Button */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="w-full text-left px-6 py-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-500 hover:text-gray-700 font-medium"
          >
            Share what's on your mind...
          </button>
        </div>

        {/* Modal for Create/Edit Post */}
        {showModal && (
          <CreatePostModal
            onClose={closeModal}
            onSubmit={editingPost ? handleEditPost : handleCreatePost}
            editPost={editingPost}
          />
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <svg className="w-8 h-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onLike={() => handleLike(post.id)}
              onComment={(content) => handleComment(post.id, content)}
              onRepost={() => handleRepost(post.id)}
              onEdit={() => openEditModal(post)}
              onDelete={() => handleDeletePost(post.id)}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-xl text-gray-500 mb-2">No posts yet</p>
              <p className="text-gray-400">Be the first to share something!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}