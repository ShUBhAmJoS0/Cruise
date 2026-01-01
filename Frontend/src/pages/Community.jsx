import React, { useState, useEffect } from "react";
import CreatePostModal from "./CreatePostModal";
import PostCard from "./PostCard";

export default function Community() {
  const [post, setPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const currentUserId = 1; 

  // Fetch the latest post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/community");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPost();
  }, []);

  // Create a new post (text + optional image)
  const handleCreatePost = async (content, image) => {
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("userId", currentUserId);
      if (image) formData.append("image", image);

      const res = await fetch("http://localhost:5000/api/community", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setPost(data); // replace current post
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Like the post
  const handleLike = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/community/${post.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
      const data = await res.json();
      setPost(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add a comment
  const handleComment = async (content) => {
    try {
      const res = await fetch(`http://localhost:5000/api/community/${post.id}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, userId: currentUserId }),
      });
      const data = await res.json();
      setPost({ ...post, CommunityComments: [...post.CommunityComments, data] });
    } catch (err) {
      console.error(err);
    }
  };

  // Repost the post
  const handleRepost = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/community/${post.id}/repost`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
      const data = await res.json();
      setPost(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ color: "#4ba0b1" }}>
            Cruise
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto pt-6 px-4"> {/* pt-6 ensures content below navbar */}

        {/* Create Post Button */}
        <div className="bg-white p-4 rounded mb-4">
          <button
            className="w-full py-2 px-4 rounded border hover:bg-gray-50 text-left"
            style={{ borderColor: "#4ba0b1" }}
            onClick={() => setShowModal(true)}
          >
            Share what's on your mind...
          </button>
        </div>

        {/* Create Post Modal */}
        {showModal && (
          <CreatePostModal
            onClose={() => setShowModal(false)}
            onSubmit={handleCreatePost}
          />
        )}

        {/* Latest Post */}
        {post ? (
          <PostCard
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onRepost={handleRepost}
          />
        ) : (
          <div className="text-center text-gray-500">No post available or unauthorized</div>
        )}
      </div>
    </div>
  );
}
