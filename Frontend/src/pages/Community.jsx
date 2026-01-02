import React, { useState, useEffect } from "react";
import CreatePostModal from "./CreatePostModal";
import PostCard from "./PostCard";
import api from "../api/axios";

export default function Community() {
  const [post, setPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const currentUserId = 1; 

  // Fetch the latest post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get("/api/community");
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

      const res = await api.post("/api/community", {
        body: formData,
      });
      const data = await res.json();
      setPost(data);
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

      {/* Main Content */}
      <div className="max-w-2xl mx-auto pt-6 px-4 mt-[20%]"> 

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
