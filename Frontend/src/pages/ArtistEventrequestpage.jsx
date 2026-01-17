import { useEffect, useState } from "react";
import api from "../api/axios";
import { Users2, Trophy, Music, Brush, MapPin, CheckCircle2, X } from "lucide-react";

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
  
  // Edit Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    location: "",
    date: "",
    time: "",
    category: "",
    description: "",
    prices: { Standard: "", Student: "", VIP: "" },
    quantity: { Standard: "", Student: "", VIP: "" },
    selectedCategory: ""
  });
  const [editCoverImage, setEditCoverImage] = useState(null);
  const [editCoverPreview, setEditCoverPreview] = useState(null);
  const [editGalleryImages, setEditGalleryImages] = useState([]);
const [removedGalleryImages, setRemovedGalleryImages] = useState([]);
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


  const handleEditClick = async (event) => {
    try {

      const res = await api.get(`/event/${event.id}`);
      const eventData = res.data;
      console.log(eventData)
      setEditingEvent(eventData);

      const parsedPrices = typeof eventData.prices === 'string' 
        ? JSON.parse(eventData.prices) 
        : eventData.prices;
      const parsedQuantities = typeof eventData.Quantity === 'string'
        ? JSON.parse(eventData.Quantity)
        : eventData.Quantity;
      
      const categoryMap = {
        "Family": "family",
        "Art": "art",
        "Sports": "sports",
        "Music": "music"
      };
      
      setEditFormData({
        title: eventData.title,
        location: eventData.location,
        date: eventData.date?.split('T')[0] || "",
        time: eventData.time,
        category: eventData.category,
        description: eventData.description,
        prices: parsedPrices,
        quantity: parsedQuantities,
        selectedCategory: categoryMap[eventData.category] || ""
      });
      
      setEditCoverPreview(eventData.profileImage ? `http://localhost:5000/${eventData.profileImage}` : null);
      setIsEditModalOpen(true);
      setEditGalleryImages(eventData.images || [])
    } catch (error) {
      console.error("Failed to fetch event details:", error);
      alert("Failed to load event details");
    }
  };


  const handleEditCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditCoverImage(file);
      setEditCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleEditGalleryChange = (e) => {
    const files = Array.from(e.target.files);

    const filesWithPreviews = files.map(file => ({
      file: file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setEditGalleryImages(prev => [...prev, ...filesWithPreviews]);
  };

const removeEditGalleryImage = (index) => {
  const img = editGalleryImages[index];
  if (img?.preview) {
    URL.revokeObjectURL(img.preview);
  }

  setEditGalleryImages(prev => prev.filter((_, i) => i !== index));
};

  const handleUpdateEvent = async () => {
    try {
      const formData = new FormData();
      
      formData.append('title', editFormData.title);
      formData.append('date', editFormData.date);
      formData.append('time', editFormData.time);
      formData.append('location', editFormData.location);
      formData.append('category', editFormData.category);
      formData.append('description', editFormData.description);
      formData.append('prices', JSON.stringify(editFormData.prices));
      formData.append('Quantity', JSON.stringify(editFormData.quantity));
      
      if (editCoverImage) {
        formData.append('profileImage', editCoverImage);
      }
      console.log(editGalleryImages)
    editGalleryImages.forEach((img) => {
      if (img?.file) {
        formData.append("images", img.file);
      }
    });

      const res = await api.put(`/artist/request/${editingEvent.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert(res.data.message || "Event updated successfully");
      setIsEditModalOpen(false);
      await LoadRequestedEvents();
      

      setEditingEvent(null);
      setEditCoverImage(null);
      setEditCoverPreview(null);
      setEditGalleryImages([]);
    } catch (error) {
      console.error("Failed to update event:", error);
      alert(error.response?.data?.message || "Failed to update event");
    }
  };


  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }
    
    try {
      await api.delete(`/artist/request/${eventId}`);
      alert("Event deleted successfully");
      await LoadRequestedEvents();
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert(error.response?.data?.message || "Failed to delete event");
    }
  };

  return (
    <div className="ml-[20%] bg-[#F5F5F5] flex flex-col p-2 md:p-10 overflow-y-auto min-h-screen">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#93CAD5] to-[#3593A6] p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Total events</p>
              <p className="text-3xl font-bold">{requestEvent.length}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <MapPin className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#a2de79] to-[#7bc963] p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Completed</p>
              <p className="text-3xl font-bold">{requestEvent.filter(item => item.status === "completed").length}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#e07a7d] to-[#d65659] p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">Pending</p>
              <p className="text-3xl font-bold">{requestEvent.filter(item => item.status === "pending").length}</p>
            </div>
            <div className="bg-white/20 p-4 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>


      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-[#3593A6] p-3 rounded-xl">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="font-bold text-gray-800 text-3xl">Add New Event</h2>
        </div>
        <p className="text-gray-600 ml-16">Create and manage your event requests</p>
      </div>

      <div className="w-full bg-white rounded-3xl shadow-xl p-8 mb-10 border border-gray-100">

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

        <button
          type="button"
          className="w-full border-2 border-[#3593A6] text-[#3593A6] py-5 rounded-2xl text-lg font-bold hover:bg-[#93CAD5] hover:text-white transition hover:shadow-xl transform hover:scale-[1.02]"
          onClick={RequestEvent}
        >
          Submit Event Request
        </button>
      </div>

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
                    onClick={() => handleEditClick(events)}
                    type="button"
                    className="px-5 py-2 text-white bg-green-400 rounded-xl font-semibold hover:bg-green-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(events.id)}
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

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between rounded-t-3xl">
              <h2 className="text-2xl font-bold text-gray-800">Edit Event</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Event Details */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Event Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Event Name</label>
                    <input
                      type="text"
                      className="w-full h-12 border-2 border-gray-200 rounded-xl p-3 focus:border-[#93CAD5] focus:outline-none"
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Location</label>
                    <input
                      type="text"
                      className="w-full h-12 border-2 border-gray-200 rounded-xl p-3 focus:border-[#93CAD5] focus:outline-none"
                      value={editFormData.location}
                      onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Date</label>
                    <input
                      type="date"
                      className="w-full h-12 border-2 border-gray-200 rounded-xl p-3 focus:border-[#93CAD5] focus:outline-none"
                      value={editFormData.date}
                      onChange={(e) => setEditFormData({...editFormData, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Time</label>
                    <input
                      type="time"
                      className="w-full h-12 border-2 border-gray-200 rounded-xl p-3 focus:border-[#93CAD5] focus:outline-none"
                      value={editFormData.time}
                      onChange={(e) => setEditFormData({...editFormData, time: e.target.value})}
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Description</label>
                  <textarea
                    className="w-full border-2 border-gray-200 rounded-xl p-3 focus:border-[#93CAD5] focus:outline-none resize-none"
                    rows="4"
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Category</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: "family", label: "Family", icon: <Users2 className="text-[#5ba3b0]"/> },
                    { id: "art", label: "Art", icon: <Brush className="text-[#5ba3b0]"/> },
                    { id: "sports", label: "Sports", icon: <Trophy className="text-[#5ba3b0]"/> },
                    { id: "music", label: "Music", icon: <Music className="text-[#5ba3b0]"/> }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`h-20 border-2 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
                        editFormData.selectedCategory === cat.id 
                          ? "border-[#3593A6] bg-[#93CAD5]/20" 
                          : "border-gray-200 hover:border-[#93CAD5]"
                      }`}
                      onClick={() => setEditFormData({
                        ...editFormData, 
                        selectedCategory: cat.id,
                        category: cat.label
                      })}
                    >
                      {cat.icon}
                      <span className="font-semibold text-sm">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Ticket Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Standard", "Student", "VIP"].map((type) => (
                    <div key={type} className="border-2 border-gray-200 rounded-xl p-4">
                      <h4 className="font-bold text-gray-800 mb-3">{type}</h4>
                      <div className="space-y-2">
                        <div>
                          <label className="text-xs font-semibold text-gray-600">Price ($)</label>
                          <input
                            type="number"
                            min="0"
                            className="w-full h-10 border-2 border-gray-200 rounded-lg px-2 text-center focus:border-[#93CAD5] focus:outline-none"
                            value={editFormData.prices[type]}
                            onChange={(e) => setEditFormData({
                              ...editFormData,
                              prices: {...editFormData.prices, [type]: e.target.value}
                            })}
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-600">Quantity</label>
                          <input
                            type="number"
                            min="0"
                            className="w-full h-10 border-2 border-gray-200 rounded-lg px-2 text-center focus:border-[#93CAD5] focus:outline-none"
                            value={editFormData.quantity[type]}
                            onChange={(e) => setEditFormData({
                              ...editFormData,
                              quantity: {...editFormData.quantity, [type]: e.target.value}
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cover Image */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Cover Image</h3>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 rounded-xl overflow-hidden bg-gray-100 border-2 border-gray-200">
                    {editCoverPreview ? (
                      <img src={editCoverPreview} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="edit-cover-upload"
                      className="bg-[#3593A6] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#93CAD5] transition cursor-pointer inline-block"
                    >
                      Change Image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleEditCoverChange}
                      id="edit-cover-upload"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Gallery Images */}
              <div className="mb-6">

           
                
                {/* Add New Images */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-600">Add New Images to Gallery</p>
                  <label
                    htmlFor="edit-gallery-upload"
                    className="bg-[#3593A6] text-white px-4 py-2 rounded-xl font-semibold hover:bg-[#93CAD5] transition cursor-pointer inline-block"
                  >
                    + Add Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleEditGalleryChange}
                    id="edit-gallery-upload"
                    className="hidden"
                  />
                  
                  {/* New Images to Upload */}
                  {editGalleryImages.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2 mt-4">New Images added ({editGalleryImages.length})</p>
                      <div className="grid grid-cols-2 gap-2">
                        {editGalleryImages.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-green-50 border-2 border-green-200 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                      
                    
                            </div>
                       <div className="w-full h-28 rounded-lg overflow-hidden border-2 border-gray-200 flex">
                            <img 
                              src={
        file.preview
          ? file.preview
          : `http://localhost:5000/${file}`
      }
                              alt={`Gallery ${index + 1}`}
                              className="w-full h-full object-cover"
                              
                            />
                            <button
                              onClick={() => removeEditGalleryImage(index)}
                              className="text-red-600 hover:bg-red-100 p-1 rounded transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateEvent}
                  className="flex-1 px-6 py-3 bg-[#3593A6] text-white rounded-xl font-semibold hover:bg-[#93CAD5] transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ArtistEventRequestPage;
