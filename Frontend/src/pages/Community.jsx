import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Community() {
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState("");
  const [loading, setLoading] = useState(false);


  const fetchPosts = async () => {
    try {
      const response = await api.get("/community");
      setPosts(response.data);
    } catch (error) {
      console.log(error);
      alert("Failed to load community posts");
    }
  };

 
  useEffect(() => {
    fetchPosts();
  }, []);


  const createPost = async () => {
    if (!content.trim()) {
      alert("Post cannot be empty");
      return;
    }

    try {
      setLoading(true);
      await api.post("/community", { content });
      setContent("");
      fetchPosts();
    } catch (error) {
      console.log(error);
      alert("Failed to post");
    } finally {
      setLoading(false);
    }
  };


  const likePost = async (postId) => {
    try {
      await api.post(`/community/${postId}/like`);
      fetchPosts();
    } catch (error) {
      console.log(error);
      alert("Failed to like post");
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 pt-20">
      <div className="w-full max-w-2xl bg-white p-6 rounded-md shadow">

        <h2 className="text-2xl font-semibold text-[#3593A6] mb-4">
          Community
        </h2>

        {/* CREATE POST */}
        <textarea
          className="w-full border rounded-md p-3 h-24 mb-3"
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={createPost}
          disabled={loading}
          className="w-full bg-[#3593A6] text-white h-11 rounded-md"
        >
          {loading ? "Posting..." : "Post"}
        </button>

        {/* POSTS */}
        <div className="mt-6 space-y-4">
          {!posts || posts.length === 0 ? (
            <p className="text-center text-gray-500">
              No posts yet
            </p>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="border rounded-md p-4"
              >
                <p className="font-semibold mb-1">
                  {post.User?.name || "User"}
                </p>

                <p className="mb-3">{post.content}</p>

                <button
                  onClick={() => likePost(post.id)}
                  className="text-sm text-[#3593A6]"
                >
                  Like ({post.likes})
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
