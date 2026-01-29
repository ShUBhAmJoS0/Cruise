

import  { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Camera, X, User, Link as LinkIcon, FileText, Mail, Sparkles, Images, Plus} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";


function ArtistEditProfile() {

  const { setDbuser } = useAuth();
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [coverpreview, setCoverpreview] = useState(null);
  const [mediaImages, setMediaImages] = useState([]);
  const [existingMediaImages, setExistingMediaImages] = useState([]);
  const [info, setInfo] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(null);
      setProfilePic(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverpreview(null);
      setCoverPic(file);
      setCoverpreview(URL.createObjectURL(file));
    }
  };

  const getImageUrl = (pathOrBlob) => {
    return `http://localhost:5000/${pathOrBlob}`;
  };

  const handleMediaImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setMediaImages(prev => [...prev, ...validFiles]);
    }
  };

  const removeMediaImage = (index, isExisting = false) => {
    if (isExisting) {
      setExistingMediaImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setMediaImages(prev => prev.filter((_, i) => i !== index));
    }
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
 
      formData.append("existingMediaImages", JSON.stringify(existingMediaImages)); 
  
      if (profilePic) formData.append("profilePic", profilePic);
      if (coverPic) formData.append("coverPic", coverPic);
  

      mediaImages.forEach((file) => {
        formData.append("mediaImages", file);
      });
  
      const response = await api.put("/artist/updateProfile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
  

      const updatedMediaImages = response.data.mediaImages || [...existingMediaImages];
  console.log("the updated media images are",updatedMediaImages)

      setDbuser(prev => ({
        ...prev,
        name: data.username,
        email: data.email,
        profileImage: profilePic ? preview : prev.profileImage,
        coverImage: coverPic ? coverpreview : prev.coverImage,
        mediaImages: updatedMediaImages 
      }));
  
      toast.success("Profile updated successfully! 🎉");
  
    } catch (e) {
      console.error("Update error:", e);
      const errorMessage = e?.response?.data?.message || "Error updating profile. Please try again.";
      toast.error(errorMessage);
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
        console.log("User data from API:", getprofile.data.user);
        console.log("Media images from API:", getprofile.data.user.mediaImages);
        setPreview(getprofile.data.user.profileImage);
        setCoverpreview(getprofile.data.user.coverImage);
        const mediaImages = getprofile.data.user.mediaImages || [];
        console.log("Setting existingMediaImages:", mediaImages);
        setExistingMediaImages(mediaImages);
      } catch (e) {
        console.log(e);
      }
    };
    getProfiledetail();
  }, [reset]);

  // Debug: Log when existingMediaImages changes
  useEffect(() => {
    console.log("existingMediaImages changed:", existingMediaImages);
  }, [existingMediaImages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f4f6] via-white to-[#d4eef3] flex items-center justify-center p-6 md:p-10 ml-[20%]">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-[#93CAD5]/20 overflow-hidden">
        <div className="md:flex">

          <div className="md:w-2/5 bg-gradient-to-b from-[#93CAD5]/15 via-[#cbe4e8] to-[#93CAD5]/10 p-8 flex flex-col items-center justify-center space-y-8">

            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 text-[#5ba3b0] mb-2">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-medium tracking-wide uppercase">Your Presence</span>
                <Sparkles className="h-5 w-5" />
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


            <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#93CAD5]/50 to-transparent" />


            <div className="relative group w-full max-w-xs">
              <div className="aspect-[3/1] rounded-2xl overflow-hidden ring-2 ring-[#93CAD5]/30 ring-offset-2 ring-offset-white shadow-lg transition-all duration-300 group-hover:ring-[#93CAD5]/60 group-hover:shadow-xl bg-gray-100">
                <img
                  src={getImageUrl(coverpreview)}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                <Camera className="h-6 w-6 text-white drop-shadow-lg" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </label>
              {coverpreview && (
                <button
                  onClick={() => { setCoverPic(null); setCoverpreview(null); }}
                  className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-gray-500 text-sm">Cover Image</p>
          </div>

          <div className="md:w-3/5 p-8 md:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 tracking-tight">Edit Profile</h2>
              <p className="text-gray-500 mt-1">Craft your artistic presence</p>
            </div>

            <form onSubmit={handleSubmit(onsubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <User className="h-4 w-4 text-[#5ba3b0]" />
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="username"
                  {...register("username", { required: true })}
                  placeholder="Your artistic name"
                  className="w-full h-11 px-4 rounded-xl border border-[#93CAD5]/30 bg-[#f8fbfc] focus:border-[#93CAD5] focus:ring-2 focus:ring-[#93CAD5]/20 focus:outline-none transition-all text-gray-800 placeholder:text-gray-400"
                />
                {errors.username && (
                  <p className="text-red-500 text-xs flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                    Name is required
                  </p>
                )}
              </div>


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


              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Sparkles className="h-4 w-4 text-[#5ba3b0]" />
                  Bio
                </label>
                <textarea
                  id="bio"
                  {...register("bio")}
                  placeholder="A short tagline that makes you stand out..."
                  className="w-full px-4 py-3 rounded-xl border border-[#93CAD5]/30 bg-[#f8fbfc] focus:border-[#93CAD5] focus:ring-2 focus:ring-[#93CAD5]/20 focus:outline-none transition-all resize-none min-h-[80px] text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="h-4 w-4 text-[#5ba3b0]" />
                  About
                </label>
                <textarea
                  id="about"
                  {...register("about")}
                  placeholder="Tell your story, share your journey..."
                  className="w-full px-4 py-3 rounded-xl border border-[#93CAD5]/30 bg-[#f8fbfc] focus:border-[#93CAD5] focus:ring-2 focus:ring-[#93CAD5]/20 focus:outline-none transition-all resize-none min-h-[100px] text-gray-800 placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <LinkIcon className="h-4 w-4 text-[#5ba3b0]" />
                  Website / Social Link
                </label>
                <input
                  id="sociallink"
                  {...register("sociallink")}
                  type="url"
                  placeholder="https://yourlink.com"
                  className="w-full h-11 px-4 rounded-xl border border-[#93CAD5]/30 bg-[#f8fbfc] focus:border-[#93CAD5] focus:ring-2 focus:ring-[#93CAD5]/20 focus:outline-none transition-all text-gray-800 placeholder:text-gray-400"
                />
              </div>

              {/* Media Gallery Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Images className="h-4 w-4 text-[#5ba3b0]" />
                  Media Gallery
                </div>
                <p className="text-xs text-gray-500">Add photos to showcase your work and connect with fans</p>

                {/* Existing Media Images */}
                {existingMediaImages.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-600">Current Gallery Images:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {existingMediaImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={`http://localhost:5000/${image}`}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            onClick={() => removeMediaImage(index, true)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Media Images Preview */}
                {mediaImages.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-600">New Images to Upload:</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {mediaImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`New ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border-2 border-[#3593A6] border-dashed"
                          />
                          <button
                            onClick={() => removeMediaImage(index, false)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 px-4 py-2 bg-[#3593A6] hover:bg-[#2d7a8a] text-white rounded-lg cursor-pointer transition-colors">
                    <Plus className="w-4 h-4" />
                    Add Images
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleMediaImagesChange}
                      className="hidden"
                    />
                  </label>
                  <span className="text-xs text-gray-500">
                    {existingMediaImages.length + mediaImages.length}/20 images
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Supported formats: JPEG, PNG, WebP, GIF. Max 5MB per image.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-[#93CAD5] hover:bg-[#7bbcc9] text-white font-semibold rounded-xl shadow-lg shadow-[#93CAD5]/30 hover:shadow-xl hover:shadow-[#93CAD5]/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArtistEditProfile;