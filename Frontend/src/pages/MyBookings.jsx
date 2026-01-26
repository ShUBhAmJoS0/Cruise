import { useState, useEffect } from "react";
import api from "../api/axios";
import { auth } from "../firbase";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 pt-20">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Bookings</h1>
          <p className="text-slate-600">Manage and track all your event bookings</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-slate-600 text-lg font-medium">No bookings yet</p>
            <p className="text-slate-500 mt-2">Start exploring events and make your first booking!</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-slate-600 mb-4">
              Showing <span className="font-semibold text-slate-900">{bookings.length}</span> booking{bookings.length !== 1 ? "s" : ""}
            </div>
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md border border-slate-200 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {booking.eventName}
                      </h2>
                      <div className="flex flex-wrap gap-3 items-center">
                        <span className="text-sm text-slate-500">
                          📅 {new Date(booking.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-emerald-600">
                        Rs. {booking.totalPrice.toLocaleString()}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">Total Amount</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="md:col-span-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Ticket Type</p>
                        <p className="text-base font-semibold text-slate-900">{booking.ticketType}</p>
                      </div>
                      <div className="md:col-span-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Quantity</p>
                        <p className="text-base font-semibold text-slate-900">{booking.quantity} ticket{booking.quantity !== 1 ? "s" : ""}</p>
                      </div>
                      <div className="md:col-span-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Attendee Name</p>
                        <p className="text-base font-semibold text-slate-900">{booking.customerName}</p>
                      </div>
                      <div className="md:col-span-1">
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Booking ID</p>
                        <p className="text-base font-mono text-slate-900">{booking.id}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Billing Address</p>
                    <p className="text-slate-700 leading-relaxed">{booking.billingAddress}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
