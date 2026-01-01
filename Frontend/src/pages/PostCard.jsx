import React, { useState } from "react";

export default function PostCard({ post, onLike, onComment, onRepost }) {
  const [commentText, setCommentText] = useState("");

  if (!post) return null;

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    onComment(commentText);
    setCommentText("");
  };

  return (
    <div className="bg-white p-4 rounded mb-4 shadow">
      {post.content && <p className="mb-2">{post.content}</p>}

      {post.imageUrl && (
        <img
          src={`http://localhost:5000${post.imageUrl}`}
          alt="Post"
          className="w-full max-h-60 object-cover rounded mb-2"
        />
      )}

      <div className="flex gap-4 mb-2">
        <button
          onClick={onLike}
          className="px-2 py-1 rounded hover:bg-gray-50"
          style={{ color: "#4ba0b1" }}
        >
          👍 Like ({post.CommunityLikes?.length || 0})
        </button>
        <button
          onClick={onRepost}
          className="px-2 py-1 rounded hover:bg-gray-50"
          style={{ color: "#4ba0b1" }}
        >
          🔁 Repost ({post.CommunityReposts?.length || 0})
        </button>
      </div>

      <div className="space-y-1 mb-2">
        {post.CommunityComments?.map((c) => (
          <div
            key={c.id}
            className="text-sm border-b border-gray-200 pb-1"
          >
            {c.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 border p-1 rounded focus:outline-none focus:border-[#4ba0b1]"
        />
        <button
          onClick={handleAddComment}
          className="px-3 py-1 rounded text-white"
          style={{ backgroundColor: "#4ba0b1" }}
        >
          Comment
        </button>
      </div>
    </div>
  );
}
