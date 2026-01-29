import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Camera, X, User, Mail, Sparkles, CheckCircle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function UserEditProfile() {
  const { setDbuser } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  
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
      setLoading(true);
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
      
      toast.success(response.data.message);
    } catch (e) {
      console.log(e?.response?.data?.message);
      toast.error(e?.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gradient-to-br from-[#e8f4f6] via-white to-[#d4eef3] flex items-center justify-center p-4 md:p-6 pt-24 pb-8">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="md:flex">
          <div className="md:w-2/5 bg-gradient-to-b from-[#93CAD5]/15 via-[#cbe4e8] to-[#93CAD5]/10 p-8 md:p-12 flex flex-col items-center justify-center space-y-6 border-r border-[#93CAD5]/20">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 text-[#5ba3b0] mb-3 px-3 py-1 bg-white rounded-full border border-[#93CAD5]/30">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold tracking-wide uppercase">Profile Photo</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Your Avatar</h3>
              <p className="text-sm text-gray-600 mt-1">Upload your profile picture</p>
            </div>

            <div className="relative group">
              <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-[#93CAD5]/40 ring-offset-4 ring-offset-white shadow-lg transition-all duration-300 group-hover:ring-[#93CAD5]/70 group-hover:shadow-2xl group-hover:ring-offset-2">
                <img
                  src={getImageUrl(preview)}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                <Camera className="h-8 w-8 text-white drop-shadow-lg" />
                <span className="text-xs text-white font-medium mt-2">Click to upload</span>
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
                  className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform hover:bg-red-600"
                  type="button"
                  title="Remove image"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            
            <div className="text-center text-sm text-gray-600">
              <p>Recommended: At least 400x400px</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="md:w-3/5 p-8 md:p-12">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Profile</h2>
              <p className="text-gray-600 mt-2">Update your personal information</p>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 animate-fade-in">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                <p className="text-green-700 font-medium">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onsubmit)} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <User className="h-4 w-4 text-[#5ba3b0]" />
                  Full Name <span className="text-red-500 font-bold">*</span>
                </label>
                <input
                  id="username"
                  {...register("username", { required: "Name is required" })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-lg border border-[#93CAD5]/30 bg-white focus:border-[#93CAD5] focus:ring-2 focus:ring-[#93CAD5]/20 focus:outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium shadow-sm hover:border-[#93CAD5]/50"
                />
                {errors.username && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                  <Mail className="h-4 w-4 text-[#5ba3b0]" />
                  Email Address
                </label>
                <input
                  id="email"
                  {...register("email", { 
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-[#93CAD5]/30 bg-white focus:border-[#93CAD5] focus:ring-2 focus:ring-[#93CAD5]/20 focus:outline-none transition-all text-gray-900 placeholder:text-gray-400 font-medium shadow-sm hover:border-[#93CAD5]/50"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 font-semibold rounded-xl transition-all duration-300 text-white flex items-center justify-center gap-2 shadow-lg shadow-[#93CAD5]/30 hover:shadow-xl hover:shadow-[#93CAD5]/40 ${
                  loading 
                    ? "bg-[#93CAD5]/70 cursor-not-allowed" 
                    : "bg-[#93CAD5] hover:bg-[#7bbcc9]"
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserEditProfile;
