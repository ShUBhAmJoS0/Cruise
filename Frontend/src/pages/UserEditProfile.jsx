import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Camera, X, User, Mail, Sparkles } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function UserEditProfile() {
  const { setDbuser } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [info, setInfo] = useState({});
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(null);
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };



  const getImageUrl = (pathOrBlob) => {
    if (!pathOrBlob) return "/images/defaultprofilepic.png";
    if (pathOrBlob instanceof Blob || pathOrBlob.startsWith("blob:")) 
      return pathOrBlob;
    return `http://localhost:5000/${pathOrBlob}`;
  };

  const onsubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      if (profilePic) formData.append("profilePic", profilePic);
      
      const response = await api.put("/user/updateProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      
      // Update context with new images
      setDbuser(prev => ({
        ...prev,
        name: data.username,
        email: data.email,
        profileImage: preview || prev.profileImage
      }));
      
      // Reset form state
      setProfilePic(null);
      
      alert(response.data.message);
    } catch (e) {
      console.log(e?.response?.data?.message);
      alert(e?.response?.data?.message || "Error updating profile");
    }
  };

  useEffect(() => {
    const getProfiledetail = async () => {
      try {
        const getprofile = await api.get("/auth/getuser");
        setInfo(getprofile.data.user);
        reset({
          username: getprofile.data.user.name || "",
          email: getprofile.data.user.email || "",
        });
        setPreview(getprofile.data.user.profileImage);
      } catch (e) {
        console.log(e);
      }
    };
    getProfiledetail();
  }, [reset]);

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#e8f4f6] via-white to-[#d4eef3] flex items-center justify-center p-6 md:p-10 mt-20">
      <div className="w-full h-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-[#93CAD5]/20 overflow-hidden">
        <div className="md:flex h-full">
          <div className="md:w-2/5 bg-gradient-to-b from-[#93CAD5]/15 via-[#cbe4e8] to-[#93CAD5]/10 p-8 flex flex-col items-center justify-center space-y-8">
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 text-[#5ba3b0] mb-2">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium tracking-wide uppercase">Your Presence</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-700">Visual Identity</h3>
            </div>
            <div className="relative group">
              <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-[#93CAD5]/40 ring-offset-4 ring-offset-white shadow-xl transition-all duration-300 group-hover:ring-[#93CAD5]/70 group-hover:shadow-2xl">
                <img
                  src={getImageUrl(preview)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                <Camera className="h-8 w-8 text-white drop-shadow-lg" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              {preview && (
                <button
                  onClick={() => { setProfilePic(null); setPreview(null); }}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-gray-500 text-sm">Profile Picture</p>


          </div>

          {/* Form Section */}
          <div className="md:w-3/5 p-8 md:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Edit Profile</h2>
              <p className="text-gray-500 mt-1">Update your profile information</p>
            </div>

            <form onSubmit={handleSubmit(onsubmit)} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="h-4 w-4 text-[#5ba3b0]" />
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="username"
                  {...register("username", { required: true })}
                  placeholder="Your name"
                  className="w-full h-11 px-4 rounded-xl border border-[#93CAD5]/30 bg-[#f8fbfc] focus:border-[#93CAD5] focus:ring-2 focus:ring-[#93CAD5]/20 focus:outline-none transition-all text-gray-800 placeholder:text-gray-400"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    Name is required
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail className="h-4 w-4 text-[#5ba3b0]" />
                  Email
                </label>
                <input
                  id="email"
                  {...register("email")}
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-11 px-4 rounded-xl border border-[#93CAD5]/30 bg-[#f8fbfc] focus:border-[#93CAD5] focus:ring-2 focus:ring-[#93CAD5]/20 focus:outline-none transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full h-12 bg-[#93CAD5] hover:bg-[#7bbcc9] text-white font-semibold rounded-xl shadow-lg shadow-[#93CAD5]/30 hover:shadow-xl hover:shadow-[#93CAD5]/40 transition-all duration-300"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserEditProfile;
