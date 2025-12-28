import { useEffect, useState } from "react";
import api from "../api/axios";

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
    <div className=" ml-[20%] bg-[#F5F5F5]  flex flex-col items-center p-2 md:p-10 overflow-y-auto">
      <h2 className="font-semibold mb-6 text-2xl">Add Events</h2>
      <div className="w-[100%] bg-white rounded-[20px] shadow-md md:p-6 flex flex-col">
        <div className="flex gap-4 flex-wrap justify-center">
          <div className="flex flex-col mt-3">
            <label>Event Name</label>
            <input
              type="text"
              className="md:w-130 h-[60px] border border-black rounded-md p-4"
              placeholder="Enter event title"
              value={EventTitle}
              onChange={e => setEventTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col mt-3">
            <label>Event Location</label>
            <input
              type="text"
              className="md:w-130 h-[60px] border border-black rounded-md p-4"
              placeholder="Enter event location"
              value={EventLocation}
              onChange={e => setEventLocation(e.target.value)}
            />
          </div>
          <div className="flex flex-col mt-3">
            <label>Event Date</label>
            <input
              type="date"
              className="md:w-130 h-[60px] border border-black rounded-md p-4"
              placeholder="Enter event date"
              value={EventDate}
              onChange={e => setEventDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col mt-3">
            <label>Event Time</label>
            <input
              type="time"
              className="md:w-130 h-[60px] border border-black rounded-md p-4"
              placeholder="Enter event Time"
              value={EventTime}
              onChange={e => setEventTime(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex flex-col m-4">
          <label>Event Description</label>
          <textarea
            className="md:w-[100%] min-h-[60px] border border-black rounded-md p-4"
            placeholder="Describe the event"
            value={eventDes}
            onChange={e=> setEventDes(e.target.value)}
            rows="3"
          />
        </div>
        
        <div className="flex flex-col py-6">
          <p className="text-sm font-bold ml-4">Category</p>
          <div className="flex md:flex-row md:gap-30 space-y-2 p-3 m-3 flex-col">
            <button
              type="button"
              className={`w-60 h-15 border-1 border-[#3593A6] rounded-lg hover:bg-[#93CAD5]/40 transition ${
                selected === "family" ? "border-3 border-[#3593A6] bg-[#93CAD5]/49" : "bg-none"
              }`}
              onClick={() => {
                setSelected("family");
                setCategory("Family");
              }}
            >
              Family
            </button>
            <button
              type="button"
              className={`w-60 h-15 border-1 border-[#3593A6] rounded-lg hover:bg-[#93CAD5]/40 transition ${
                selected === "art" ? "border-3 border-[#3593A6] bg-[#93CAD5]/40" :"bg-none"
              }`}
              onClick={() => {
                setSelected("art");
                setCategory("Art");
              }}
            >
              Art
            </button>
            <button
              type="button"
              className={`w-60 h-15 border-1 border-[#3593A6] rounded-lg hover:bg-[#93CAD5]/40 transition ${
                selected === "sports" ? "border-3 border-[#3593A6] bg-[#93CAD5]/40" : "bg-none"
              }`}
              onClick={() => {
                setSelected("sports");
                setCategory("Sports");
              }}
            >
              Sports
            </button>
            <button
              type="button"
              className={`w-60 h-15 border-1 border-[#3593A6] rounded-lg hover:bg-[#93CAD5]/40 transition ${
                selected === "music" ? "border-3 border-[#3593A6] bg-[#93CAD5]/40" : "bg-none"
              }`}
              onClick={() => {
                setSelected("music");
                setCategory("Music");
              }}
            >
              Music
            </button>
          </div>
        </div>
        
        <div className="flex flex-col">
          <p className="text-sm font-bold ml-4">Ticket Price</p>
          <div className="flex md:flex-col m-3 items-center">
            <div className="grid grid-cols-3 gap-y-5 gap-x-6 w-full p-5 bg-[#F1F0F0]/40 md:px-20 rounded-lg shadow-inner place-items-center">
              <p className="font-bold ">Ticket</p>
              <p className="font-bold">Price</p>
              <p className="font-bold">Quantity</p>

              {["Standard", "Student", "VIP"].map((type) => (
                <>
                  <div
                    key={`${type}-label`}
                    className="w-40 h-10 border-2 border-[#93CAD5] rounded-lg flex items-center justify-center bg-[#93CAD5]/49"
                  >
                    {type}
                  </div>
                  <input
                    key={`${type}-price`}
                    type="number"
                    min="0"
                    value={Price[type]}
                    onChange={(e) =>
                      setPrice({
                        ...Price,
                        [type]: e.target.value
                      })
                    }
                    className="h-10 w-28 border border-black rounded-md px-3 text-center"
                    placeholder="Price"
                  />
                  <input
                    key={`${type}-qty`}
                    type="number"
                    min="0"
                    value={Quantity[type]}
                    onChange={(e) =>
                      setQuantity({
                        ...Quantity,
                        [type]: e.target.value
                      })
                    }
                    className="h-10 w-28 border border-black rounded-md px-3 text-center"
                    placeholder="Qty"
                  />
                </>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex flex-col mt-4">
          <p className="text-sm font-bold ml-4">Add Cover Image</p>
          <div className="flex items-center w-[100%] gap-x-50">
            <label className="w-30 h-30 bg-[#F2F2F2] m-4 rounded-lg flex items-center justify-center">
              <img src={selectedImage ? imagePreviewUrl : "/images/preview.png"} alt="Preview" />
            </label>
            <div className="gap-x-3 flex items-center">
              <label>Add Image:</label>
              <label
                htmlFor="image-upload"
                className="bg-[#93CAD5] w-50 h-10 text-white rounded-md p-4 flex justify-center items-center hover:bg-[#93CAD5]/30 transition hover:text-black cursor-pointer"
              >
                Choose from files
              </label>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              id="image-upload"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => {
                setSelectedImage(null);
                setImagePreviewUrl(null);
              }}
              className="p-3 text-white text-[15px] rounded-md mt-4 transition hover:opacity-70 bg-[#93CAD5]"
            >
              Remove
            </button>
          </div>
        </div>
        
        <div className="flex flex-col mt-4">
          <p className="text-sm font-bold ml-4">Add Event Images</p>
          <div className="gap-x-3 flex items-center p-2 md:p-4">
            <label>Add Image:</label>
            <label
              htmlFor="image-uploads"
              className="bg-[#93CAD5] w-50 h-10 text-white rounded-md p-4 flex justify-center items-center hover:bg-[#93CAD5]/30 transition hover:text-black cursor-pointer"
            >
              Choose from files
            </label>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleMultipleImages}
            id="image-uploads"
            className="hidden"
          />
          {selectedImages.length > 0 && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="font-semibold mb-2">Selected Images ({selectedImages.length}):</p>
              <ul className="space-y-2">
                {selectedImages.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-white p-2 rounded">
                    <span className="text-sm truncate">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-3 text-white text-[15px] rounded-md mt-4 transition hover:opacity-70 bg-[#93CAD5]"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <button
          type="button"
          className="w-30 self-center bg-[#3593A6] text-white py-2 md:py-5 mt-6 rounded-md text-sm font-semibold hover:bg-[#93CAD5] hover:text-black"
          onClick={RequestEvent}
        >
          Add Event
        </button>
      </div>
      
      <div className="flex flex-col justify-center items-center w-[100%] mt-8 bg-[white] rounded-[20px] p-3 shadow-sm">
        <h2 className="font-bold m-4">Manage Added Events</h2>
        <div className="mt-4 p-4 bg-gray-100 rounded-lg w-[100%]">
            {requestEvent.length === 0 ? (
            <p className="text-center text-gray-500 py-4">No events requested yet</p>
          ) : 
          <ul className="space-y-2">
            {requestEvent.map((events) => (
              <li key={events.id} className="flex items-center justify-between bg-white p-4 rounded">
                <img src={`http://localhost:5000/${events.profileImage}`} className="w-15 h-15 rounded-full"
              alt={events.title}></img>
                <span className="text-sm ">{events.title}</span>
                  <span className={`px-4 py-2 rounded-full text-s font-medium ${
                      events.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      events.status === 'approved' ? 'bg-green-100 text-green-800' :
                      events.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {events.status}
                    </span>
                <button
                  type="button"
                  className="p-3 text-white text-[15px] rounded-md mt-4 transition hover:opacity-70 bg-[#93CAD5]"
                >
                  Remove request
                </button>
              </li>
            ))}
          </ul>
}
        </div>
      </div>
    </div>
  );
}

export default ArtistEventRequestPage;