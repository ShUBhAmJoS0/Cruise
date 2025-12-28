
import React, { useState } from "react";
import { useEffect } from "react";
import api from "../api/axios";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

function ArtistEditProfile() {
  const { setDbuser } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const[coverPic,setCoverPic] = useState(null)
  const[coverpreview,setCoverpreview]=useState(null)
const[info,setInfo] = useState({})
 const { register, handleSubmit, reset,formState: { errors }} = useForm();
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(null)
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };
    const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverpreview(null)
      setCoverPic(file);
      setCoverpreview(URL.createObjectURL(file));
    }
  };

const getImageUrl = (pathOrBlob) => {
  if (!pathOrBlob) return "/images/defaultprofilepic.png"; 
  if (pathOrBlob.startsWith("http") || pathOrBlob.startsWith("blob:")) return pathOrBlob;
  return `http://localhost:5000/${pathOrBlob}`;
};
const onsubmit = async(data)=>{
try{
  const formData = new FormData();
  formData.append("username",data.username)
    formData.append("email", data.email);
    formData.append("bio", data.bio);
    formData.append("sociallink", data.sociallink);
 formData.append("profilePic", profilePic);
 formData.append("coverPic", coverPic);
 const response = await api.put("/artist/updateProfile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  
  setDbuser(prev => ({
    ...prev,
    name: data.username,
    email:data.email,
     profileImage: profilePic === null && preview === null ? "" : preview || prev.profileImage,
  coverImage: coverPic === null && coverpreview === null ? "" : coverpreview || prev.coverImage
  }));  
alert(response.data.message)

}
catch(e){
console.log(e.response.data.message)
alert(e.response?.data?.message)
}
}
  useEffect(()=>{

const getProfiledetail=async()=>{
    try{
    const getprofile = await api.get("/auth/getuser")
    setInfo(getprofile.data.user)
    console.log(getprofile.data.message)
    console.log(getprofile.data.user)
    reset({
          username: getprofile.data.user.name || "",
          email: getprofile.data.user.email || "",
          bio: getprofile.data.user.bio || "",
          sociallink: getprofile.data.user.social || "",
    }
    
    )
    console.log(getprofile.data.user.profileImage)
    setPreview(getprofile.data.user.profileImage)
    setCoverpreview(getprofile.data.user.coverImage)
    }
    catch(e){
        console.log(e)
    }
}
getProfiledetail()
},[])
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 ml-[20%]">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg p-8 md:flex md:space-x-8">

        <div className="flex flex-col items-center md:w-1/3 mb-6 md:mb-0">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 flex justify-center items-center border-[#93CAD5] shadow-md cursor-pointer hover:opacity-90 transition">
            <img src={getImageUrl(preview) || "/images/defaultprofilepic.png"}alt="Profile" className="w-full h-full object-cover" />
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
          <button onClick={()=>{setProfilePic(null),setPreview(null)}}  className="w-full bg-[#93CAD5] hover:bg-[#82c7a1] text-white font-semibold p-3 rounded-lg mt-4 transition">Remove profile image</button>
       
                    <div className="mt-10 relative w-32 h-32  overflow-hidden border-4 flex justify-center items-center border-[#93CAD5] shadow-md cursor-pointer hover:opacity-90 transition">
            <img src={getImageUrl(coverpreview) || "/images/defaultprofilepic.png"} alt="Profile" className="w-full h-full object-cover" />
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
            <button onClick={()=>{setCoverPic(null),setCoverpreview(null)}} className="w-full bg-[#93CAD5] hover:bg-[#82c7a1] text-white font-semibold p-3 rounded-lg mt-4 transition">Remove cover image</button>
        </div>


        <div className="md:w-2/3">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Profile</h2>
          <form className="space-y-4" onSubmit={handleSubmit(onsubmit)}>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
               {...register("username", { required: true })} 
                type="text"
                placeholder="Your Name"
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#93CAD5] focus:border-transparent transition"
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">name is required</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
              {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#93CAD5] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <input 
              type="text"
               {...register("bio")}
                placeholder="Tell us about yourself..."
                className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#93CAD5] focus:border-transparent transition resize-none h-24"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website / Social Link</label>
              <input
                type="url"
                {...register("sociallink")}
                placeholder="https://yourlink.com"
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
