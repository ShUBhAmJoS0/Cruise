import { useState, useEffect } from "react";
import api from "../api/axios";
import { auth } from "../firebase";
import TicketPopup from "../components/ticketpopup";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showTicket, setShowTicket] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await api.get("/api/booking", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data.data);
      } catch (err) {
        setError("Failed to load bookings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "completed":
        return "bg-green-100 text-green-800 border border-green-300";
      case "failed":
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center pt-20">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 shadow-md max-w-md text-center">
          <div className="text-red-600 text-3xl mb-3">⚠️</div>
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7fa] p-6 pt-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-2">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-1 tracking-tight">
              My Bookings
            </h1>
            <p className="text-slate-500 text-lg">
              Manage and track all your event bookings
            </p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl shadow border border-slate-200 p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-slate-600 text-lg font-semibold">
              No bookings yet
            </p>
            <p className="text-slate-400 mt-2">
              Start exploring events and make your first booking!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-sm text-slate-600 mb-4">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {bookings.length}
              </span>{" "}
              booking{bookings.length !== 1 ? "s" : ""}
            </div>
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden relative group"
              >
                <div className="p-8 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-slate-900 mb-1 truncate">
                      {booking.eventName}
                    </h2>
                    <div className="flex flex-wrap gap-3 items-center mb-2">
                      <span className="text-sm text-slate-500">
                        📅{" "}
                        {new Date(booking.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(booking.paymentStatus)}`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                          Ticket Type
                        </p>
                        <p className="text-base font-semibold text-slate-900">
                          {booking.ticketType}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                          Quantity
                        </p>
                        <p className="text-base font-semibold text-slate-900">
                          {booking.quantity} ticket
                          {booking.quantity !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                          Attendee Name
                        </p>
                        <p className="text-base font-semibold text-slate-900">
                          {booking.customerName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                          Booking ID
                        </p>
                        <p className="text-base font-mono text-slate-900">
                          {booking.id}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 min-w-[160px]">
                    <p className="text-3xl font-bold text-emerald-600">
                      NPR {booking.totalPrice.toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400">Total Amount</p>
                    <button
                      className="mt-4 px-5 py-2 rounded-lg border border-[#256d7b] text-[#256d7b] font-semibold shadow-sm hover:bg-[#f0f8fa] transition-colors"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowTicket(true);
                      }}
                    >
                      View Ticket
                    </button>
                  </div>
                </div>
                <div className="border-t border-slate-200 px-8 pb-8">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 mt-4">
                    Billing Address
                  </p>
                  <p className="text-slate-700 leading-relaxed">
                    {booking.billingAddress}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {showTicket && selectedBooking && (
          <TicketPopup
            booking={{
              ...selectedBooking,
              eventDetails: {
                date: selectedBooking.createdAt,
                time: "", // You may want to fetch or store event time
                location: selectedBooking.billingAddress, // Or use actual event location if available
              },
            }}
            onClose={() => setShowTicket(false)}
          />
        )}
      </div>
    </div>
  );
}
