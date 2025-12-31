import { useState } from "react"

export default function Community() {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(234)
  const [openPost, setOpenPost] = useState(false)
  const [text, setText] = useState("")

  const toggleLike = () => {
    setLiked(!liked)
    setLikes(liked ? likes - 1 : likes + 1)
  }

  const createPost = () => {
    if (!text.trim()) return
    alert("Post created")
    setText("")
    setOpenPost(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}
      <div className="sticky top-0 bg-white border-b">
        <div className="max-w-2xl mx-auto p-4 flex justify-between">
          <h1 className="text-xl font-bold text-[#449cae]">Cruise</h1>
          <div className="flex gap-4 text-gray-600">
            <button>Search</button>
            <button>Notifications</button>
            <button>Menu</button>
          </div>
        </div>
      </div>

      {/* CREATE POST */}
      <div className="max-w-2xl mx-auto bg-white border-b p-4">
        <button
          onClick={() => setOpenPost(true)}
          className="w-full bg-gray-100 p-3 rounded-full text-left text-gray-600"
        >
          Share what's on your mind...
        </button>
      </div>

      {/* SINGLE POST */}
      <div className="max-w-2xl mx-auto bg-white border-b p-4">
        <div className="flex gap-3">
          <img
            src="/woman-avatar.png"
            className="w-12 h-12 rounded-full"
          />

          <div className="flex-1">
            <div className="flex gap-2 text-sm">
              <p className="font-semibold">Sarah Anderson</p>
              <p className="text-gray-500">@sarahanders</p>
              <p className="text-gray-400">· 2h</p>
            </div>

            <p className="mt-2 text-gray-900">
              Just experienced the most amazing sunset cruise!
            </p>

            <img
              src="/sunset-cruise-ocean.jpg"
              className="mt-3 rounded-xl border"
            />

            <div className="flex gap-8 mt-4 text-gray-600 text-sm">
              <button onClick={toggleLike}>
                {liked ? "Liked" : "Like"} · {likes}
              </button>
              <button>Comment · 45</button>
              <button>Share</button>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE POST MODAL */}
      {openPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white w-full max-w-lg rounded-xl p-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write something..."
              className="w-full bg-gray-100 p-3 rounded"
              rows={5}
            />

            <div className="flex justify-end gap-4 mt-4">
              <button onClick={() => setOpenPost(false)}>Cancel</button>
              <button
                onClick={createPost}
                className="bg-[#449cae] text-white px-5 py-2 rounded-full"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
