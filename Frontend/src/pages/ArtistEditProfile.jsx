ArtistEditProfile.jsx
import React, { useState } from "react";
import { useEffect } from "react";
import api from "../api/axios";

function ArtistEditProfile() {
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState();
  const[coverPic,setCoverPic] = useState(null)
  const[coverpreview,setCoverpreview]=useState(null)
const[info,setInfo] = useState("")
  const getProfiledetail = async()=>{

  }
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };
    const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverPic(file);
      setCoverpreview(URL.createObjectURL(file));
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: API call to update artist profile
    alert("Profile updated!");
  };
  useEffect(()=>{
const getProfiledetail=async()=>{
    try{
    const getprofile = await api.get("/auth/getuser")
    setInfo(getprofile.data.data)
    console.log(getprofile.data.message)
    }
    catch(e){
        console.log(e)
    }

}},[])
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 ml-[20%]">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg p-8 md:flex md:space-x-8">

        <div className="flex flex-col items-center md:w-1/3 mb-6 md:mb-0">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 flex justify-center items-center border-[#93CAD5] shadow-md cursor-pointer hover:opacity-90 transition">
            <img src="/images/preview.png" alt="Profile" className="w-10 h-10 object-cover" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <p className="mt-4 text-gray-600 text-sm text-center">
            Click image to change profile picture
          </p>
                    <div className="mt-10 relative w-32 h-32  overflow-hidden border-4 flex justify-center items-center border-[#93CAD5] shadow-md cursor-pointer hover:opacity-90 transition">
            <img src="/images/preview.png" alt="Profile" className="w-10 h-10 object-cover" />
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
          <p className="mt-4 text-gray-600 text-sm text-center">
            Click image to change cover picture
          </p>
        </div>


        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
default{
    
}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#93CAD5] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#93CAD5] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                placeholder="Tell us about yourself..."
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#93CAD5] focus:border-transparent transition resize-none h-24"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website / Social Link</label>
              <input
                type="url"
                placeholder="https://yourwebsite.com"
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#93CAD5] focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#93CAD5] hover:bg-[#82b8c7] text-white font-semibold p-3 rounded-lg mt-4 transition"
            >
              Save Changes
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default ArtistEditProfile;
