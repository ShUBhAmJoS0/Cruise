import { useEffect, useState } from "react";
import api from "../api/axios";

function ArtistEventRequestPage(){
const [EventTittle,setEventTittle]=useState("");
const [EventLocation,setEventlocation] = useState("");
const[Category,setCategory]=useState("")
const[EventDate,setEventDate]=useState("")
const[EventTime,setEventTime]=useState("")
const[Price,setPrice]=useState( {Standard: "",
  Student: "",
  VIP: ""})
const[Quantity,setQuantity]=useState({
  Standard: "",
  Student: "",
  VIP: ""
})
const[selected,setSelected]=useState("")
const[eventDes,setEventdis]=useState("")

// const SendRequest=async(){

// }

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
  setImagePreviewUrl(URL.createObjectURL(file));
    }
  };
  const handleMultipleImages = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(prev=>[...prev, ...files]);
  };

  const removeImage = (index) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  useEffect(()=>{
const LoadrquestedEvents=async()=>{
  try {
    const res = await api.get("/event/request");
    const Events = res.data
console.log(res.data)
alert(res)
  } catch (e) {
    console.log(e)
    alert(e.response?.data?.message)
    
  }

}
  }

  )
  const RequestEvent = async()=>{
    try {
      const res = await api.post("/event/request",{title:EventTittle,date:EventDate,time:EventTime,location:EventLocation,category:Category,prices:Price, description:eventDes, Quantity: Quantity,  profileImage: selectedImage ? imagePreviewUrl : null,  images: selectedImages.map(file => file.name)});
      alert(res.data.message);
    } catch (error) {
      const msg=error.response?.data?.message;
      console.log(error.response?.data?.message)
      alert(msg)
    }
    

  }

return (
  
<div className=" h-[100dvh] w-[80%] ml-[20%] bg-[#F1F0F0] flex flex-col items-center p-2 md:p-10 ">
    <h2 className=" font-semibold mb-6 ">Add Events</h2>
    <div className=" w-[100%] bg-white rounded-[20px] shadow-md md:p-6 flex flex-col">
        <div className="flex gap-4 flex-wrap justify-center ">
        <div className="flex flex-col mt-3">
        <label>Event Name</label><input type="text" className="md:w-130 h-[60px] border border-black rounded-md p-4" placeholder="Enter event title"  value={EventTittle}
  onChange={e => setEventTittle(e.target.value)}></input>
        </div>
        <div className="flex flex-col mt-3">
        <label>Event Location</label><input type="text" className="md:w-130 h-[60px] border border-black rounded-md p-4" placeholder="Enter event location"  value={EventLocation}
  onChange={e => setEventlocation(e.target.value)}></input>
        </div>
        <div className="flex flex-col mt-3">
        <label>Event Date</label><input type="text" className="md:w-130 h-[60px] border border-black rounded-md p-4" placeholder="Enter event date"  value={EventDate}
  onChange={e => setEventDate(e.target.value)}></input>
        </div>
        <div className="flex flex-col mt-3">
        <label>Event Time</label><input type="text" className="md:w-130 h-[60px] border border-black rounded-md p-4" placeholder="Enter event Time"  value={EventTime

        }
  onChange={e => setEventTime(e.target.value)}></input>
        </div>
     
        </div>
           <div className="flex flex-col m-4">
        <label>Event Description</label><input type="text" className="md:w-[100%] h-[60px] border border-black rounded-md p-4" placeholder="Describe the event"  value={eventDes}
  onChange={e => setEventdis(e.target.value)}></input>
        </div>
<div className = "flex flex-col py-6">
        <p className="text-s font-bold ml-4">Category</p>
        <div className="flex md:flex-row md:gap-30 space-y-2 p-3 m-3 flex-col ">
<button className={`w-60 h-15 bg-[#93CAD5] rounded-lg hover:bg-[#93CAD5]/40 transition ${selected=="family"?"border-3 border-[#3593A6] bg-[#93CAD5]/49":"border-none"}`} onClick={()=>{setSelected("family"),setCategory("Family")}}>Family</button>
<button className={`w-60 h-15 bg-[#93CAD5] rounded-lg hover:bg-[#93CAD5]/40 transition ${selected=="art"?"border-3 border-[#3593A6] bg-[#93CAD5]/40":"border-none"}`} onClick={()=>{setSelected("art"),setCategory("Art")}}>Art</button>
<button className={`w-60 h-15 bg-[#93CAD5] rounded-lg hover:bg-[#93CAD5]/40 transition ${selected=="sports"?"border-3 border-[#3593A6] bg-[#93CAD5]/40":"border-none"}`} onClick={()=>{setSelected("sports"),setCategory("Sports")}}>Sports</button>
<button className={`w-60 h-15 bg-[#93CAD5] rounded-lg hover:bg-[#93CAD5]/40 transition ${selected=="music"?"border-3 border-[#3593A6] bg-[#93CAD5]/40":"border-none"}`} onClick={()=>{setSelected("music"),setCategory("Music")}} >Music</button>
        </div>
        </div>
        <div className = "flex flex-col ">
        <p className="text-s font-bold  ml-4">Ticket Price</p>
        <div className="flex md:flex-col m-3 items-center ">
<div className="grid grid-cols-3 gap-y-5 gap-x-6 w-full p-5 bg-[#F1F0F0]/40 md:px-20 rounded-lg shadow-inner place-items-center">

  {/* Headers */}
  <p className="font-bold">Ticket</p>
  <p className="font-bold">Price</p>
  <p className="font-bold">Quantity</p>

  {["Standard", "Student", "VIP"].map((type) => (
    <>
      {/* Ticket type */}
      <div
        key={`${type}-label`}
        className="w-40 h-10 border-2 border-[#93CAD5] rounded-lg flex items-center justify-center"
      >
        {type}
      </div>

      {/* Price */}
      <input
        key={`${type}-price`}
        type="number"
        min="0"
        value={Price[type]}
        onChange={(e) =>
          setPrice({
            ...Price,
            [type]: Number(e.target.value),
          })
        }
        className="h-10 w-28 border border-black rounded-md px-3 text-center"
        placeholder="Price"
      />

      {/* Quantity */}
      <input
        key={`${type}-qty`}
        type="number"
        min="0"
        value={Quantity[type]}
        onChange={(e) =>
          setQuantity({
            ...Quantity,
            [type]: Number(e.target.value),
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
        <div className = "flex flex-col mt-4 ">
        <p className="text-s font-bold  ml-4 ">Add Cover Image</p>
        <div className="flex  items-center  w-[100%] gap-x-50">
        <label className="w-30 h-30 bg-[#F2F2F2] m-4 rounded-lg flex items-center justify-center">
<img src={selectedImage?imagePreviewUrl:"/images/preview.png"}></img>
        </label>
        <div className="gap-x-3 flex items-center ">
<label>Add Image:</label>
<label htmlFor="image-upload" className="bg-[#93CAD5] w-50 h-10 text-white rounded-md p-4 flex justify-center items-center hover:bg-[#93CAD5]/30 transition hover:text-black transition">Choose from files</label>
</div>

<input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        id="image-upload"
        className="hidden"
      />
      <button onClick={()=>{setSelectedImage(null); setImagePreviewUrl(null);}} className="p-3 text-white text-[15px] rounded-md  mt-4 transition hover:opacity-70 bg-[#93CAD5]">Remove</button>
</div>
</div>
       <div className = "flex flex-col mt-4 ">
        <p className="text-s font-bold  ml-4 ">Add Event Images</p>
      <div className="gap-x-3 flex items-center p-2 md:p-4 ">
<label>Add Image:</label>
<label htmlFor="image-uploads" className="bg-[#93CAD5] w-50 h-10 text-white rounded-md p-4 flex justify-center items-center hover:bg-[#93CAD5]/30 transition hover:text-black transition">Choose from files</label>
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
                    onClick={() => removeImage(index) }
                    className="p-3 text-white text-[15px] rounded-md  mt-4 transition hover:opacity-70 bg-[#93CAD5]"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        </div>
        <button className= "w-30 self-center bg-[#3593A6] text-white py-2 md:py-5 mt-6 rounded-md text-sm font-semibold hover:bg-[#93CAD5] hover:text-black"onClick={RequestEvent}>Add Event</button>
        </div>
        <div className="flex flex-col justify-center items-center w-[100%]">
          <h2 className="font-bold m-4">Manage Added Events</h2>
           <div className="mt-4 p-4 bg-gray-100 rounded-lg w-[100%]">
                <ul className="space-y-2">
              {selectedImages.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-white p-2 rounded">
                  <span className="text-sm truncate">{file.name}</span>
                  <button 
                    onClick={() => removeImage(index) }
                    className="p-3 text-white text-[15px] rounded-md  mt-4 transition hover:opacity-70 bg-[#93CAD5]"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
           </div>
        </div>
    </div>
)

}

export default ArtistEventRequestPage
