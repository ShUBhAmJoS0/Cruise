// src/pages/BookingPage.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { auth } from "../firebase";
import {
  Calendar,
  MapPin,
  Clock,
  Minus,
  Plus,
  ChevronRight,
  Info,
  Ticket,
  Gem,
  GraduationCap,
  CreditCard,
  ShieldCheck,
  ArrowLeft
} from "lucide-react";

async function fetchEvent(eventId) {
  const id = parseInt(eventId, 10);
  if (Number.isNaN(id)) {
    throw new Error(`Invalid event id: ${eventId}`);
  }
  const res = await api.get(`/event/${id}`);
  return res.data;
}

async function createBooking(data, eventId) {
  const token = await auth.currentUser.getIdToken();
  const res = await api.post("/api/booking", { ...data, eventId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
}

const TicketCard = ({ id, label, description, price, available, icon: Icon, limited, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col p-6 rounded-2xl border-2 transition-all cursor-pointer ${active ? "border-[#3593A6] bg-[#F0F9FA]" : "border-slate-100 bg-white hover:border-slate-200"
        }`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-xl ${active ? "bg-[#3593A6] text-white" : "bg-slate-100 text-slate-500"}`}>
          <Icon size={24} />
        </div>
        {limited && (
          <span className="px-2 py-1 bg-[#F0F9FA] text-[#3593A6] text-[10px] font-bold uppercase tracking-wider rounded-lg border border-[#CEE9ED]">
            Limited
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-2">{label}</h3>
      <p className="text-sm text-slate-500 mb-6 flex-grow">{description}</p>

      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-black text-slate-900 leading-none">Rs. {price}</span>
        </div>
        <div className={`text-[10px] font-medium px-2 py-1 rounded-full ${available === "Unlimited" ? "bg-slate-100 text-slate-500" : "bg-cyan-50 text-cyan-600"
          }`}>
          {typeof available === "number" ? `${available} Available` : available}
        </div>
      </div>
    </div>
  );
};

const PaymentCard = ({ label, icon: Icon, active, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 transition-all cursor-pointer ${active ? "border-[#3593A6] bg-[#F0F9FA]" : "border-slate-100 bg-white hover:border-slate-200"
        }`}
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${active ? "bg-cyan-100 text-[#3593A6]" : "bg-slate-100 text-slate-400"
        }`}>
        {Icon ? <Icon size={32} /> : <CreditCard size={32} />}
      </div>
      <span className={`font-bold uppercase tracking-widest text-sm ${active ? "text-slate-900" : "text-slate-500"}`}>
        {label}
      </span>
    </div>
  );
};

export default function BookingPage() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [ticketType, setTicketType] = useState("VIP");
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("ESEWA");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      try {
        const data = await fetchEvent(eventId);
        setEvent(data);
      } catch (e) {
        setError("Failed to load event details.");
      }
    };
    if (eventId) loadEvent();
  }, [eventId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error</h2>
          <p className="text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => navigate("/explore")}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="w-12 h-12 border-4 border-[#3593A6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  const ticketPrices = event.prices || {};
  const ticketCounts = event.Quantity || {};
  const currentPrice = Number(ticketPrices[ticketType]) || 0;
  const subtotal = currentPrice * quantity;
  const processingFee = Math.round(subtotal * 0.05);
  const total = subtotal + processingFee;

  const eventDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await createBooking({
        ticket_type: ticketType,
        quantity,
        payment_method: paymentMethod,
        event_id: eventId,
      });
      alert(`Booking request for ${ticketType} ticket(s) submitted! Redirecting to ${paymentMethod}...`);
      navigate("/my-bookings");
    } catch (e) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          {event.category && (
            <span className="inline-block px-3 py-1 bg-[#3593A6] text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4">
              {event.category || "Art & Culture"}
            </span>
          )}
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            {event.title}
          </h1>
          <div className="flex flex-wrap gap-6 text-slate-500 font-semibold">
            <div className="flex items-center gap-2">
              <Calendar size={20} className="text-[#3593A6]" />
              <span>{eventDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-[#3593A6]" />
              <span>{event.time || "4:00 PM - 8:00 PM"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-[#3593A6]" />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main Booking Controls */}
          <div className="lg:col-span-2 space-y-12">

            {/* Step 1: Ticket Selection */}
            <section>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Select Ticket Type</h2>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Step 1 of 2</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <TicketCard
                  label="VIP"
                  description="Front row seating, artist meet-and-greet, and gift bag."
                  price={ticketPrices["VIP"] || 2500}
                  available={ticketCounts["VIP"] || 5}
                  icon={Gem}
                  limited={true}
                  active={ticketType === "VIP"}
                  onClick={() => setTicketType("VIP")}
                />
                <TicketCard
                  label="Standard"
                  description="General admission access to the main gallery."
                  price={ticketPrices["Standard"] || 1200}
                  available={ticketCounts["Standard"] || "Unlimited"}
                  icon={Ticket}
                  active={ticketType === "Standard"}
                  onClick={() => setTicketType("Standard")}
                />
                <TicketCard
                  label="Student"
                  description="Requires valid student identification at entry."
                  price={ticketPrices["Student"] || 600}
                  available={ticketCounts["Student"] || "Available"}
                  icon={GraduationCap}
                  active={ticketType === "Student"}
                  onClick={() => setTicketType("Student")}
                />
              </div>
            </section>

            {/* Quantity Selector */}
            <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
              <span className="font-bold text-slate-900">Quantity</span>
              <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-[#3593A6] hover:text-white hover:border-[#3593A6] transition-all shadow-sm"
                >
                  <Minus size={18} />
                </button>
                <span className="text-xl font-black text-slate-900 min-w-[2rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-[#3593A6] hover:text-white hover:border-[#3593A6] transition-all shadow-sm"
                >
                  <Plus size={18} />
                </button>
              </div>
            </section>

            {/* Step 2: Payment Method */}
            <section>
              <div className="flex justify-between items-end mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Payment Method</h2>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Step 2 of 2</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <PaymentCard
                  label="ESEWA"
                  active={paymentMethod === "ESEWA"}
                  onClick={() => setPaymentMethod("ESEWA")}
                />
                <PaymentCard
                  label="KHALTI"
                  active={paymentMethod === "KHALTI"}
                  onClick={() => setPaymentMethod("KHALTI")}
                />
                <PaymentCard
                  label="BANK TRANSFER"
                  active={paymentMethod === "BANK"}
                  onClick={() => setPaymentMethod("BANK")}
                />
              </div>
            </section>

            {/* Info Alert */}
            <div className="bg-[#F0F9FA] border-2 border-[#CEE9ED] p-6 rounded-2xl flex gap-4 text-[#0F766E]">
              <div className="bg-[#89BDC9] text-white p-1 rounded-full w-fit h-fit">
                <Info size={16} />
              </div>
              <p className="text-sm font-medium leading-relaxed">
                After clicking "Complete Booking", you will be redirected to the secure portal of your chosen provider to complete the payment.
              </p>
            </div>

          </div>

          {/* Sidebar: Order Summary */}
          <aside className="sticky top-32">
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-2xl">
              <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Order Summary</h3>

              <div className="space-y-6 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-400">Ticket Type</span>
                  <span className="font-bold text-slate-900">{ticketType} Admission</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-400">Price (per ticket)</span>
                  <span className="font-bold text-slate-900">Rs. {currentPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-400">Quantity</span>
                  <span className="font-bold text-slate-900">{quantity}</span>
                </div>

                <div className="h-px bg-slate-100 my-4"></div>

                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-400">Subtotal</span>
                  <span className="font-bold text-slate-900">Rs. {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-slate-400">Processing Fee (5%)</span>
                  <span className="font-bold text-slate-900">Rs. {processingFee.toFixed(2)}</span>
                </div>

                <div className="pt-6">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">Rs. {total.toFixed(2)}</p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-[#3593A6] text-white py-5 rounded-2xl font-black text-lg shadow-lg shadow-cyan-100 hover:shadow-cyan-200 hover:-translate-y-1 transition-all active:translate-y-0 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Complete Booking"}
              </button>

              <button
                onClick={() => navigate(-1)}
                className="w-full text-slate-400 text-sm font-bold mt-6 hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
              >
                Cancel and return to event
              </button>

              <div className="mt-12 flex justify-center gap-6 text-slate-200">
                <ShieldCheck size={28} />
                <Ticket size={28} />
                <CreditCard size={28} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
