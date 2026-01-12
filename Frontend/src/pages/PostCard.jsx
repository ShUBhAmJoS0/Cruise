import React, { useState } from "react";

export default function PostCard({ post, userId, onLike, onComment, onRepost }) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const hasLiked = post.Likes?.some((like) => like.userId === userId) || false;

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    
    setIsCommenting(true);
    try {
      await onComment(commentText);
      setCommentText("");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleLikeClick = async () => {
    setIsLiking(true);
    try {
      await onLike();
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow mb-6 overflow-hidden">
      {/* User Info */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
            {post.User?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {post.User?.name || "Anonymous User"}
            </h3>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* Post Content */}
        <p className="text-gray-800 leading-relaxed mb-4">{post.content}</p>

        {post.image && (
          <img
            src={`http://localhost:5000${post.image}`}
            alt="post"
            className="rounded-xl w-full max-h-96 object-cover"
          />
        )}
      </div>

      {/* Engagement Stats */}
      <div className="px-6 py-2 border-t border-b border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{post.Likes?.length || 0} likes</span>
          <span>
            {post.Comments?.length || 0} comments · {post.Repost?.length || 0} reposts
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 py-3 flex items-center justify-around">
        <button
          onClick={handleLikeClick}
          disabled={isLiking}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-gray-50 ${
            hasLiked ? "text-red-500 font-semibold" : "text-gray-600"
          }`}
        >
          {hasLiked ? (
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )}
          <span className="text-sm">{hasLiked ? "Liked" : "Like"}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-gray-50 text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-sm">Comment</span>
        </button>

        <button
          onClick={onRepost}
          className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all hover:bg-gray-50 text-gray-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="text-sm">Repost</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="px-6 py-4 bg-gray-50 border-t">
          {post.Comments && post.Comments.length > 0 ? (
            <div className="space-y-3 mb-4">
              {post.Comments.map((comment) => (
                <div key={comment.id} className="bg-white p-4 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {comment.User?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-gray-800">
                        {comment.User?.name || "Anonymous"}
                      </p>
                      <p className="text-gray-700 mt-1">{comment.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">
              No comments yet. Be the first!
            </p>
          )}

          {/* Add Comment */}
          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitComment()}
              placeholder="Write a comment..."
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-blue-500 focus:outline-none transition-colors"
            />
            <button
              onClick={handleSubmitComment}
              disabled={!commentText.trim() || isCommenting}
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              {isCommenting ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}