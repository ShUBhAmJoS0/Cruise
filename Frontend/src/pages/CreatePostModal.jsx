import React, { useState } from "react";

export default function CreatePostModal({ onClose, onSubmit }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    if (!content.trim() && !image) return; 
    onSubmit(content, image);
    setContent("");
    setImage(null);
  };

  return (
    <div className="bg-white border p-4 rounded shadow mb-4">
      <textarea
        rows={3}
        placeholder="Share what's on your mind..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full border p-2 rounded mb-2 focus:outline-none focus:border-[#4ba0b1]"
      />

      {image && (
        <div className="mb-2">
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            className="w-full max-h-40 object-cover rounded"
          />
        </div>
      )}

      <div className="flex justify-between items-center">
        <input
          type="file"
          onChange={(e) => e.target.files[0] && setImage(e.target.files[0])}
        />
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded border hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-1 rounded text-white"
            style={{ backgroundColor: "#4ba0b1" }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
