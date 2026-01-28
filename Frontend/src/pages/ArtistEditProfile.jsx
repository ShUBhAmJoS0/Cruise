

import  { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Camera, X, User, Link as LinkIcon, FileText, Mail, Sparkles, Upload, Image as ImageIcon, Save, ArrowLeft } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


function ArtistEditProfile() {
  const { setDbuser } = useAuth();
  const navigate = useNavigate();
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [coverpreview, setCoverpreview] = useState(null);
  const [info, setInfo] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const validateImageFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, WebP, or GIF)');
      return false;
    }

    if (file.size > maxSize) {
      alert('Image size must be less than 5MB');
      return false;
    }

    return true;
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file && validateImageFile(file)) {
      // Revoke previous URL to prevent memory leaks
      if (preview && preview.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file && validateImageFile(file)) {
      // Revoke previous URL to prevent memory leaks
      if (coverpreview && coverpreview.startsWith('blob:')) {
        URL.revokeObjectURL(coverpreview);
      }
      setCoverPic(file);
      setCoverpreview(URL.createObjectURL(file));
    }
  };

  const removeProfileImage = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }
    setProfilePic(null);
    setPreview(null);
  };

  const removeCoverImage = () => {
    if (coverpreview && coverpreview.startsWith('blob:')) {
      URL.revokeObjectURL(coverpreview);
    }
    setCoverPic(null);
    setCoverpreview(null);
  };

  const getImageUrl = (pathOrBlob) => {
    return `http://localhost:5000/${pathOrBlob}`;
  };

  const onsubmit = async (data) => {
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("bio", data.bio);
      formData.append("sociallink", data.sociallink);
      formData.append("about", data.about);

      if (profilePic) formData.append("profilePic", profilePic);
      if (coverPic) formData.append("coverPic", coverPic);

      const response = await api.put("/artist/updateProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      // Update auth context
      setDbuser(prev => ({
        ...prev,
        name: data.username,
        email: data.email,
        profileImage: profilePic ? preview : prev.profileImage,
        coverImage: coverPic ? coverpreview : prev.coverImage
      }));

      alert("Profile updated successfully! 🎉");
      navigate(-1); // Go back to previous page

    } catch (e) {
      console.error("Update error:", e);
      const errorMessage = e?.response?.data?.message || "Error updating profile. Please try again.";
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
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
          about:getprofile.data.user.about || "",
          bio: getprofile.data.user.bio || "",
          sociallink: getprofile.data.user.social || "",
        });
        console.log(getprofile.data.about)
        setPreview(getprofile.data.user.profileImage);
        setCoverpreview(getprofile.data.user.coverImage);
      } catch (e) {
        console.log(e);
      }
    };
    getProfiledetail();
  }, [reset]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Edit Artist Profile</h1>
              <p className="text-slate-600 text-sm">Customize your artistic presence</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Image Upload Section */}
          <div className="lg:col-span-1 space-y-8">
            {/* Profile Picture Upload */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 text-[#3593A6] mb-3">
                  <Sparkles className="h-5 w-5" />
                  <span className="text-sm font-semibold tracking-wide uppercase">Profile Picture</span>
                  <Sparkles className="h-5 w-5" />
                </div>
                <p className="text-slate-600 text-sm">Your face to the artistic world</p>
              </div>

              <div className="relative group">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden ring-4 ring-slate-200 ring-offset-4 ring-offset-white shadow-2xl transition-all duration-300 group-hover:ring-[#3593A6]/50">
                  <img
                    src={preview || `http://localhost:5000/${info.profileImage}` || '/default-avatar.png'}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />

                  {/* Upload Overlay */}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-white mx-auto mb-2" />
                      <p className="text-white text-sm font-medium">Change Photo</p>
                    </div>
                  </div>
                </div>

                {/* Upload Button */}
                <label className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[#3593A6] hover:bg-[#2d7a8a] rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all duration-200 hover:scale-110">
                  <Camera className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>

                {/* Remove Button */}
                {(preview || info.profileImage) && (
                  <button
                    onClick={removeProfileImage}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                    type="button"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>

              <div className="mt-8 text-center">
                <p className="text-xs text-slate-500 mb-2">Supported formats: JPEG, PNG, WebP, GIF</p>
                <p className="text-xs text-slate-500">Max size: 5MB</p>
              </div>
            </div>

            {/* Cover Image Upload */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 text-[#3593A6] mb-3">
                  <ImageIcon className="h-5 w-5" />
                  <span className="text-sm font-semibold tracking-wide uppercase">Cover Image</span>
                  <ImageIcon className="h-5 w-5" />
                </div>
                <p className="text-slate-600 text-sm">Your artistic backdrop</p>
              </div>

              <div className="relative group">
                <div className="aspect-[3/1] rounded-2xl overflow-hidden ring-2 ring-slate-200 ring-offset-2 ring-offset-white shadow-xl transition-all duration-300 group-hover:ring-[#3593A6]/50">
                  <img
                    src={coverpreview || `http://localhost:5000/${info.coverImage}`}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />

                  {/* Upload Overlay */}
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-white mx-auto mb-2" />
                      <p className="text-white text-sm font-medium">Change Cover</p>
                    </div>
                  </div>
                </div>

                {/* Upload Button */}
                <label className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-[#3593A6] hover:bg-[#2d7a8a] rounded-full flex items-center justify-center shadow-lg cursor-pointer transition-all duration-200 hover:scale-110">
                  <Camera className="w-6 h-6 text-white" />
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                </label>

                {/* Remove Button */}
                {(coverpreview || info.coverImage) && (
                  <button
                    onClick={removeCoverImage}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-slate-500 mb-1">Banner image for your profile</p>
                <p className="text-xs text-slate-500">Recommended: 1200x400px</p>
              </div>
            </div>
          </div>

          {/* Main Content - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
              {/* Progress Bar */}
              {isSubmitting && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">Uploading...</span>
                    <span className="text-sm text-slate-500">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-[#3593A6] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Artist Details</h2>
                <p className="text-slate-600">Tell your story and connect with your audience</p>
              </div>

              <form onSubmit={handleSubmit(onsubmit)} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <User className="w-5 h-5 text-[#3593A6]" />
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <User className="h-4 w-4 text-[#3593A6]" />
                        Artist Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register("username", { required: "Artist name is required" })}
                        placeholder="Your artistic name"
                        className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-[#3593A6] focus:ring-2 focus:ring-[#3593A6]/20 focus:outline-none transition-all text-slate-800 placeholder:text-slate-400"
                      />
                      {errors.username && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                          {errors.username.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Mail className="h-4 w-4 text-[#3593A6]" />
                        Email Address
                      </label>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="your@email.com"
                        className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-[#3593A6] focus:ring-2 focus:ring-[#3593A6]/20 focus:outline-none transition-all text-slate-800 placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Artistic Identity */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#3593A6]" />
                    Artistic Identity
                  </h3>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Sparkles className="h-4 w-4 text-[#3593A6]" />
                      Bio Tagline
                    </label>
                    <input
                      {...register("bio")}
                      placeholder="A catchy phrase that defines your art..."
                      maxLength={150}
                      className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-[#3593A6] focus:ring-2 focus:ring-[#3593A6]/20 focus:outline-none transition-all text-slate-800 placeholder:text-slate-400"
                    />
                    <p className="text-xs text-slate-500">Max 150 characters</p>
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <FileText className="h-4 w-4 text-[#3593A6]" />
                      About You
                    </label>
                    <textarea
                      {...register("about")}
                      placeholder="Share your artistic journey, inspiration, and what makes your work unique..."
                      rows={6}
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-[#3593A6] focus:ring-2 focus:ring-[#3593A6]/20 focus:outline-none transition-all resize-none text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Online Presence */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-[#3593A6]" />
                    Online Presence
                  </h3>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <LinkIcon className="h-4 w-4 text-[#3593A6]" />
                      Website / Social Link
                    </label>
                    <input
                      {...register("sociallink")}
                      type="url"
                      placeholder="https://instagram.com/yourusername"
                      className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 bg-slate-50 focus:border-[#3593A6] focus:ring-2 focus:ring-[#3593A6]/20 focus:outline-none transition-all text-slate-800 placeholder:text-slate-400"
                    />
                    <p className="text-xs text-slate-500">Your Instagram, website, or other social platform</p>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-14 bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] hover:from-[#2d7a8a] hover:to-[#1e5f6f] text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Artist Profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistEditProfile;
