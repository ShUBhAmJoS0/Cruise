import React, { useState } from "react";

export default function PostCard({post, userId, onLike, onComment, onRepost,}) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  const hasLiked =
    post.Likes?.some((like) => like.userId === userId) || false;

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    onComment(commentText);
    setCommentText("");
  };

  return (
    <div className="bg-white rounded shadow mb-4 p-4">
      <p className="mb-3 text-gray-800">{post.content}</p>
      {post.image && (
        <img
          src={`http://localhost:5000/${post.image}`}
          alt="post"
          className="rounded mb-3 max-h-96 object-cover"
        />
      )}

      <div className="flex justify-between text-sm text-gray-600 mb-3">
        <button
          onClick={onLike}
          className={`hover:underline ${
            hasLiked ? "text-blue-600 font-semibold" : ""
          }`}
        >
          👍 {hasLiked ? "Liked" : "Like"} ({post.Likes?.length || 0})
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="hover:underline"
        >
          💬 Comment ({post.Comments?.length || 0})
        </button>

        <button onClick={onRepost} className="hover:underline">
          🔁 Repost ({post.Repost?.length || 0})
        </button>
      </div>

      {/* COMMENTS SECTION */}
      {showComments && (
        <div className="mt-3">
          {/* EXISTING COMMENTS */}
          {post.Comments && post.Comments.length > 0 ? (
            post.Comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-100 p-2 rounded mb-2 text-sm"
              >
                {comment.content}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-400">No comments yet</p>
          )}

          {/* ADD COMMENT */}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="flex-1 border rounded px-3 py-1 text-sm"
            />
            <button
              onClick={handleSubmitComment}
              className="bg-blue-500 text-white px-3 rounded text-sm"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
