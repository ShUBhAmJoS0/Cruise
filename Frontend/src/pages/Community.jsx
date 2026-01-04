import React, { useState, useEffect } from "react";
import CreatePostModal from "./CreatePostModal";
import PostCard from "./PostCard";
import api from "../api/axios";

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const currentUserId = 1;

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await api.get("/api/community");
        setPosts(res.data || []);
      } catch (err) {
        console.error("LOAD POSTS ERROR:", err);
      }
    };

    loadPosts();
  }, []);

  
  const handleCreatePost = async (content, image) => {
    try {
      const formData = new FormData();
      formData.append("content", content);
      formData.append("userId", currentUserId);
      if (image) formData.append("image", image);

      await api.post("/api/community", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });


      const res = await api.get("/api/community");
      setPosts(res.data || []);

      setShowModal(false);
    } catch (err) {
      console.error("CREATE POST ERROR:", err);
    }
  };


  const handleLike = async (postId) => {
    try {
      await api.post(`/api/community/${postId}/like`, {
        userId: currentUserId,
      });

      const res = await api.get("/api/community");
      setPosts(res.data || []);
    } catch (err) {
      console.error("LIKE ERROR:", err);
    }
  };

 
  const handleComment = async (postId, content) => {
    try {
      await api.post(`/api/community/${postId}/comment`, {
        content,
        userId: currentUserId,
      });

      const res = await api.get("/api/community");
      setPosts(res.data || []);
    } catch (err) {
      console.error("COMMENT ERROR:", err);
    }
  };


  const handleRepost = async (postId) => {
    try {
      await api.post(`/api/community/${postId}/repost`, {
        userId: currentUserId,
      });

      const res = await api.get("/api/community");
      setPosts(res.data || []);
    } catch (err) {
      console.error("REPOST ERROR:", err);
    }
  };

  return (
  <div className="min-h-screen bg-gray-100 mt-38">
      <div className="max-w-2xl mx-auto px-4">

        {/* CREATE POST */}
        <div className="bg-white p-4 rounded shadow mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="w-full text-left px-4 py-2 border rounded hover:bg-gray-50"
            style={{ borderColor: "#4ba0b1" }}
          >
            Share what's on your mind...
          </button>
        </div>

        {showModal && (
          <CreatePostModal
            onClose={() => setShowModal(false)}
            onSubmit={handleCreatePost}
          />
        )}

        {/* POSTS */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              userId={currentUserId}
              onLike={() => handleLike(post.id)}
              onComment={(content) =>
                handleComment(post.id, content)
              }
              onRepost={() => handleRepost(post.id)}
            />
          ))
        ) : (
          <p className="text-center text-gray-500">
            No posts yet
          </p>
        )}
      </div>
    </div>
  );
}
