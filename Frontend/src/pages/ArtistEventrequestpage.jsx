import { useEffect, useState } from "react";
import api from "../api/axios";
import {Users2,PaintRollerIcon,Trophy,Music, Brush} from "lucide-react"

function ArtistEventRequestPage() {
  const [EventTitle, setEventTitle] = useState("");
  const [EventLocation, setEventLocation] = useState("");
  const [Category, setCategory] = useState("");
  const [EventDate, setEventDate] = useState("");
  const [EventTime, setEventTime] = useState("");
  const [Price, setPrice] = useState({
    Standard: "",
    Student: "",
    VIP: ""
  });
  const [Quantity, setQuantity] = useState({
    Standard: "",
    Student: "",
    VIP: ""
  });
  const [selected, setSelected] = useState("");
  const [eventDes, setEventDes] = useState("");
  const [requestEvent, setRequestEvent] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleMultipleImages = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const LoadRequestedEvents = async () => {
    try {
      const res = await api.get("/artist/request");
      const Events = res.data;
      setRequestEvent(Events.data);
      console.log(res.data);
    } catch (e) {
      console.log(e);
      alert(e.response?.data?.message || "Failed to load events");
    }
  };

  useEffect(() => {
    LoadRequestedEvents();
  }, []);

  const RequestEvent = async () => {
    try {
      const formData = new FormData();
      
      formData.append('title', EventTitle);
      formData.append('date', EventDate);
      formData.append('time', EventTime);
      formData.append('location', EventLocation);
      formData.append('category', Category);
      formData.append('description', eventDes);
      formData.append('prices', JSON.stringify(Price));
      formData.append('Quantity', JSON.stringify(Quantity));
      
      if (selectedImage) {
        formData.append('profileImage', selectedImage);
      }
    
      selectedImages.forEach((file) => {
        formData.append('images', file);
      });

      const res = await api.post("/artist/request", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(res.data.message);
   
      await LoadRequestedEvents();
  
      setEventTitle("");
      setEventLocation("");
      setEventDate("");
      setEventTime("");
      setCategory("");
      setEventDes("");
      setPrice({ Standard: "", Student: "", VIP: "" });
      setQuantity({ Standard: "", Student: "", VIP: "" });
      setSelected("");
      setSelectedImage(null);
      setSelectedImages([]);
      setImagePreviewUrl(null);
    
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to create event";
      console.log(error.response?.data?.message);
      alert(msg);
    }
  };

  return (
    <div className="ml-[20%] bg-[#F5F5F5] flex flex-col p-2 md:p-10 overflow-y-auto min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-[#3593A6] p-3 rounded-xl">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="font-bold  text-gray-800 text-3xl ">Add New Event</h2>
        </div>
        <p className="text-gray-600 ml-16">Create and manage your event requests</p>
      </div>

      {/* Main Form Card */}
      <div className="w-full bg-white rounded-3xl shadow-xl p-8 mb-10 border border-gray-100">
        {/* Basic Information Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-[#3593A6] rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800">Event Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">Event Name</label>
              <input
                type="text"
                className="h-[55px] border-2 border-gray-200 rounded-xl p-4 focus:border-[#93CAD5] focus:outline-none transition"
                placeholder="Enter event title"
                value={EventTitle}
                onChange={e => setEventTitle(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">Event Location</label>
              <input
                type="text"
                className="h-[55px] border-2 border-gray-200 rounded-xl p-4 focus:border-[#93CAD5] focus:outline-none transition"
                placeholder="Enter event location"
                value={EventLocation}
                onChange={e => setEventLocation(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">Event Date</label>
              <input
                type="date"
                className="h-[55px] border-2 border-gray-200 rounded-xl p-4 focus:border-[#93CAD5] focus:outline-none transition"
                value={EventDate}
                onChange={e => setEventDate(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-2">Event Time</label>
              <input
                type="time"
                className="h-[55px] border-2 border-gray-200 rounded-xl p-4 focus:border-[#93CAD5] focus:outline-none transition"
                value={EventTime}
                onChange={e => setEventTime(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex flex-col mt-6">
            <label className="text-sm font-semibold text-gray-700 mb-2">Event Description</label>
            <textarea
              className="min-h-[100px] border-2 border-gray-200 rounded-xl p-4 focus:border-[#93CAD5] focus:outline-none transition resize-none"
              placeholder="Describe the event in detail..."
              value={eventDes}
              onChange={e => setEventDes(e.target.value)}
              rows="4"
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-[#3593A6] rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800">Event Category</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: "family", label: "Family", icon: <Users2 className="text-[#5ba3b0]"/> },
              { id: "art", label: "Art", icon: <Brush className="text-[#5ba3b0]"/> },
              { id: "sports", label: "Sports", icon: <Trophy className="text-[#5ba3b0]"/> },
              { id: "music", label: "Music", icon: <Music className="text-[#5ba3b0]"/> }
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`h-24 border-2 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all transform hover:scale-105 ${
                  selected === cat.id 
                    ? "border-[#3593A6] bg-[#93CAD5]/20 shadow-lg" 
                    : "border-gray-200 hover:border-[#93CAD5]"
                }`}
                onClick={() => {
                  setSelected(cat.id);
                  setCategory(cat.label);
                }}
              >
                <span className="text-3xl">{cat.icon}</span>
                <span className="font-semibold text-gray-700">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Ticket Pricing */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-[#3593A6] rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800">Ticket Information</h3>
          </div>
          
          <div className="bg-[#F8F9FA] rounded-2xl p-6 border-2 border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {["Standard", "Student", "VIP"].map((type) => (
                <div key={type} className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-[#93CAD5] transition">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-[#93CAD5] w-2 h-2 rounded-full"></div>
                    <h4 className="font-bold text-gray-800">{type} Ticket</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-600 mb-1">Price ($)</label>
                      <input
                        type="number"
                        min="0"
                        value={Price[type]}
                        onChange={(e) => setPrice({ ...Price, [type]: e.target.value })}
                        className="h-11 border-2 border-gray-200 rounded-lg px-3 text-center focus:border-[#93CAD5] focus:outline-none transition"
                        placeholder="0.00"
                      />
                    </div>
                    
                    <div className="flex flex-col">
                      <label className="text-xs font-semibold text-gray-600 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="0"
                        value={Quantity[type]}
                        onChange={(e) => setQuantity({ ...Quantity, [type]: e.target.value })}
                        className="h-11 border-2 border-gray-200 rounded-lg px-3 text-center focus:border-[#93CAD5] focus:outline-none transition"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cover Image Upload */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-[#3593A6] rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800">Cover Image</h3>
          </div>
          
          <div className="bg-[#F8F9FA] rounded-2xl p-6 border-2 border-dashed border-gray-300">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-40 h-40 rounded-2xl overflow-hidden bg-white border-2 border-gray-200 flex items-center justify-center">
                {selectedImage ? (
                  <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>
              
              <div className="flex-1 flex flex-col gap-3">
                <p className="text-sm text-gray-600">Upload a cover image for your event (PNG, JPG)</p>
                <div className="flex gap-3">
                  <label
                    htmlFor="image-upload"
                    className="bg-[#3593A6] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#93CAD5] transition cursor-pointer"
                  >
                    Choose Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    id="image-upload"
                    className="hidden"
                  />
                  {selectedImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreviewUrl(null);
                      }}
                      className="px-6 py-3 text-red-600 border-2 border-red-600 rounded-xl font-semibold hover:bg-red-50 transition"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Multiple Images Upload */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-[#3593A6] rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-800">Event Gallery</h3>
          </div>
          
          <div className="bg-[#F8F9FA] rounded-2xl p-6 border-2 border-dashed border-gray-300">
            <div className="flex flex-col gap-4">
              <label
                htmlFor="image-uploads"
                className="bg-[#3593A6] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#93CAD5] transition cursor-pointer w-fit"
              >
                + Add Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleMultipleImages}
                id="image-uploads"
                className="hidden"
              />
              
              {selectedImages.length > 0 && (
                <div className="mt-4">
                  <p className="font-semibold text-gray-700 mb-3">Selected Images ({selectedImages.length})</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedImages.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-4 rounded-xl border-2 border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#93CAD5]/20 p-2 rounded-lg">
                            <svg className="w-5 h-5 text-[#3593A6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <span className="text-sm text-gray-700 truncate max-w-[200px]">{file.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          className="w-full bg-[#3593A6] text-white py-5 rounded-2xl text-lg font-bold hover:bg-[#93CAD5] transition shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          onClick={RequestEvent}
        >
          Submit Event Request
        </button>
      </div>

      {/* Requested Events List */}
      <div className="w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-[#3593A6] p-3 rounded-xl">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Manage Added Events</h2>
        </div>

        <div className="space-y-4">
          {requestEvent.length === 0 ? (
            <div className="text-center py-12 bg-[#F8F9FA] rounded-2xl">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-gray-500 font-semibold">No events requested yet</p>
              <p className="text-gray-400 text-sm mt-2">Your event requests will appear here</p>
            </div>
          ) : (
            requestEvent.map((events) => (
              <div key={events.id} className="flex flex-col md:flex-row items-center justify-between bg-[#F8F9FA] p-5 rounded-2xl border-2 border-gray-200 hover:border-[#93CAD5] transition">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <img 
                    src={`http://localhost:5000/${events.profileImage}`} 
                    className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
                    alt={events.title}
                  />
                  <div>
                    <h3 className="font-bold text-gray-800">{events.title}</h3>
                    <p className="text-sm text-gray-500">Event Request</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className={`px-5 py-2 rounded-xl text-sm font-bold ${
                    events.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' :
                    events.status === 'approved' ? 'bg-green-100 text-green-700 border-2 border-green-300' :
                    events.status === 'rejected' ? 'bg-red-100 text-red-700 border-2 border-red-300' :
                    'bg-gray-100 text-gray-700 border-2 border-gray-300'
                  }`}>
                    {events.status.toUpperCase()}
                  </span>
                  
                  <button
                    type="button"
                    className="px-5 py-2 text-white bg-red-500 rounded-xl font-semibold hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ArtistEventRequestPage;