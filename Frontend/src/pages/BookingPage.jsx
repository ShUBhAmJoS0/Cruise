// src/pages/BookingPage.jsx

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { auth } from "../firbase";


async function fetchEvent(eventId) {
    const id = parseInt(eventId, 10);
  if (Number.isNaN(id)) {
    throw new Error(`Invalid event id: ${eventId}`);
  }
  console.log("Fetching event ID:", id)

  const res = await api.get(`/event/${id}`); 
   console.log(res.data)
  return res.data;
 
}
//Sliding images function
function ImageSlider({ images}) {
    const[currentIndex,setCurrentIndex] = useState(0);

    if(!images || images.length==0) {return null};



  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3; // Number of images visible at a time

  const next = () => {
    setStartIndex((prev) =>
      prev + visibleCount >= images.length ? 0 : prev + visibleCount
    );
  };

  const prev = () => {
    setStartIndex((prev) =>
      prev - visibleCount < 0 ? images.length - visibleCount : prev - visibleCount
    );
  };

  const visibleImages = images.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="relative w-full px-6 py-4">
    <div className="flex overflow-hidden space-x-2 h-32 md:h-60">
      {visibleImages.map((img, i) => (
        <div key={i} className="flex-1 rounded-md overflow-hidden">
          <img
             src= {`http://localhost:5000/${img}`} 
            alt={`event-${i}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>

      {/* Prev/Next buttons */}
      <button
        type="button"
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white px-2 py-1 rounded-md"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white px-2 py-1 rounded-md"
      >
        ›
      </button>
    </div>
  );
}


async function createBooking(data) {
  const token = await auth.currentUser.getIdToken();
  const res = await api.post("/api/booking", data,{
      headers: { Authorization: `Bearer ${token}` }
    });   
  return res.data;
}

// Ticket Button Component
const TicketButton = ({ label, desc,des, active, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 border rounded-md p-3 md:p-9 text-left text-sm shadow-md
      ${active ? "border-teal-500 bg-teal-50" : "border-gray-300 bg-white"}`}
    >
      <div className="font-semibold">{label}</div>
      <div className="text-xs text-gray-500 mt-1">{desc}</div>
      <div className="text-xs text-gray-500 mt-1">{des}</div>
    </button>
  );
};

export default function BookingPage() {
  const { id : eventId } = useParams(); // expects route like /booking/:id

  // Event + form state
  const [event, setEvent] = useState(null);
  const [ticketType, setTicketType] = useState("VIP");
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await fetchEvent(eventId);
        setEvent(data);
        setTicketType("VIP");
        setQuantity(1);
      } catch (e) {
        setMessage("Failed to load event.");
      }
    };

    if (eventId) {
      loadEvent();
    }
  }, [eventId]);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-md shadow">Loading event...</div>
      </div>
    );
  }

  // Prices: prefer event.prices JSON, fall back to single event.price
  const ticketPrices = event.prices || {};
  const price =ticketPrices[ticketType]||0;
  const subtotal = price * quantity;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;

  // Nicely formatted event date
  const eventDate = new Date(event.date).toLocaleString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await createBooking({
        ticket_type: ticketType,
        quantity,
        customer_name: name,
        billing_address: billingAddress,
        email,
        card_number: cardNumber,
      });
      alert ("Booking Confirmed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full h-full  overflow-auto bg-[#F1F0F0]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3593A6] to-[#93CAD5] text-white p-4 md:p-12 flex items-center">
          <div>
            <h1 className="text-xl font-semibold md:text-[40px]">{event.title}</h1>
            <p className="text-xs md:text-[16px]">
              {eventDate} • {event.location}
            </p>
          </div>
        </div>

        {/* Image Slider */}
        <ImageSlider images={event.images} />

        {/* Event note / description */}
        <div className="px-6 py-4">
          <div className="bg-white border border-3 border-[#90C7D2] text-black text-sm p-4 md:p-10 rounded-md space-y-3">
            <p>
              <span className="font-semibold text-[#3593A6] mr-2">Event Hour:</span>{" "}
              {event.time}
            </p>
            <p>
              <span className="font-semibold text-[#3593A6] mr-2">Services:</span>{" "}
              {event.services}
            </p>
            <p>
              <span className="font-semibold text-[#3593A6] mr-2">Description:</span>{" "}
              {event.description}
            </p>
          </div>
        </div>

        {/* Booking form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6 px-6 pb-8">

          {/* Ticket section */}
          <div className="bg-white p-4 md:p-6  rounded-md">
            <h2 className="text-lg font-semibold mb-3">Book Ticket</h2>
            <p className="text-xs text-gray-500 mb-2">Select Ticket Type</p>

            <div className="flex gap-3 mb-3  rounded-md">
                 <TicketButton
                    label="VIP"
                    desc="Front row seating "
                    des={ticketPrices["VIP"]}
                    active={ticketType === "VIP"}
                    onClick={() => setTicketType("VIP")}
                  />
                  <TicketButton
                    label="Standard"
                    desc="General admission"
                    des={ticketPrices["Standard"]}
                    active={ticketType === "Standard"}
                    onClick={() => setTicketType("Standard")}
                  />
                  <TicketButton
                    label="Student"
                    desc="Student ID required"
                    des={ticketPrices["Student"]}
                    active={ticketType === "Student"}
                    onClick={() => setTicketType("Student")}
                  />
           
              
            </div>

            <div className="flex items-center gap-3">
              <label className="text-xs text-gray-500">Quantity</label>
              <input
                type="number"
                min="1"
                className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Number(e.target.value) || 1))
                }
              />
            </div>
          </div>

          {/* Payment Info */}
          <div className="space-y-4 bg-white p-4 md:p-7 rounded-md">
            <h3 className="text-lg font-semibold">Payment Information</h3>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-500 rounded-md px-3 py-2 md:py-5 text-sm"
                value={name}
            
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Card Number
              </label>
              <input
                type="text"
                className="w-full border border-gray-500 rounded-md px-3 py-2 md:py-5 text-sm"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Billing Address
              </label>
              <textarea
                className="w-full border border-gray-500 rounded-md px-3 py-2 text-sm"
                rows="3"
                value={billingAddress}
                onChange={(e) => setBillingAddress(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-3 mt-6 bg-white md:p-7 rounded-md">
            <h3 className="text-lg font-semibold">Order Summary</h3>
            <div className="border border-gray-200 rounded-md p-4 text-sm space-y-2">
              <div className="flex justify-between">
                <span>Ticket Price</span>
                <span>Rs. {price}</span>
              </div>
              <div className="flex justify-between">
                <span>Quantity</span>
                <span>{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>Rs. {tax}</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>Rs. {total}</span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="space-x-2 mt-4 flex ">
            <button
              type="submit"
              className="w-full bg-[#3593A6] text-white py-2 md:py-6 rounded-md text-sm font-semibold hover:bg-[#93CAD5] hover:text-black disabled:opacity-60"
            >
Book
            </button>

            <button
              type="button"
              className="w-full border border-gray-600 text-gray-900 py-2 rounded-md text-sm font-semibold hover:bg-gray-50"
              onClick={() => {
                setName("");
                setBillingAddress("");
                setEmail("");
                setCardNumber("");
                setMessage("");
                setQuantity(1);

              }}
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
 </div>
);
}
